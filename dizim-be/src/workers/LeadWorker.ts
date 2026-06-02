import { Worker, Job } from 'bullmq';
import { connection } from '../queues';
import { qualifyLead } from '../ai';
import { auditService } from '../services/audit';
import { getEventBus } from '../events';

const LEAD_UID = 'api::lead.lead';

export function createLeadWorker(): Worker {
  const worker = new Worker(
    'lead:qualification',
    async (job: Job) => {
      const { leadId } = job.data;

      console.log(`[LeadWorker] Qualifying lead ${leadId}`);

      const strapi = (global as any).strapi;
      const lead = await strapi.entityService.findOne(LEAD_UID, leadId);

      if (!lead) {
        throw new Error(`Lead ${leadId} not found`);
      }

      const result = await qualifyLead({
        full_name: lead.full_name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        monthly_orders: lead.monthly_orders,
        message: lead.message,
        inquiry_type: lead.inquiry_type,
        expected_platform: lead.expected_platform,
      });

      const previousLevel = lead.lead_level;

      await strapi.entityService.update(LEAD_UID, leadId, {
        data: {
          lead_score: result.leadScore,
          lead_level: result.leadLevel.toLowerCase(),
          ai_summary: result.summary,
          publishedAt: null,
        },
      });

      await auditService.log({
        lead_id: leadId,
        action: 'lead_qualified',
        previous_value: { lead_score: lead.lead_score, lead_level: lead.lead_level },
        new_value: { lead_score: result.leadScore, lead_level: result.leadLevel },
        metadata: { ai_summary: result.summary, recommended_action: result.recommendedAction },
      });

      getEventBus().emit('lead:qualified', {
        leadId,
        leadScore: result.leadScore,
        leadLevel: result.leadLevel,
        summary: result.summary,
        previousLevel,
      });

      if (result.leadLevel === 'HOT') {
        getEventBus().emit('lead:hot', {
          leadId,
          leadScore: result.leadScore,
          summary: result.summary,
          email: lead.email,
          fullName: lead.full_name,
          company: lead.company,
        });
      }

      return result;
    },
    {
      connection,
      concurrency: 10,
      lockDuration: 60000,
    }
  );

  worker.on('completed', (job: Job) => {
    console.log(`[LeadWorker] Job ${job.id} completed for lead ${job.data.leadId}`);
  });

  worker.on('failed', (job: Job | undefined, error: Error) => {
    console.error(`[LeadWorker] Job ${job?.id} failed:`, error.message);
  });

  return worker;
}
