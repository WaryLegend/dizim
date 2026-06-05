"use client";

import { useState } from "react";
import { Button } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";
import { Textarea } from "@/components/shadcn-ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-ui/select";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

const inquiryTypes = [
  "General Inquiry",
  "Sales",
  "Support",
  "Partnership",
  "Demo Request",
  "Other",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Contact form:", formData);
    setIsLoading(false);
    setSubmitted(true);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-background min-h-screen">
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
              Contact Us
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              Have questions? {"We'd"} love to hear from you. Send us a message
              and {"we'll"} respond as soon as possible.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="border-border rounded-2xl border bg-white p-8 shadow-sm">
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                    <Send className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h2 className="text-foreground mb-2 text-2xl font-bold">
                    Message Sent!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Thank you for contacting us. {"We'll"} get back to you
                    within 24 hours.
                  </p>
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        inquiryType: "",
                        message: "",
                      });
                    }}
                    className="bg-primary hover:bg-primary/90 rounded-full px-8 text-white"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-foreground mb-4 text-xl font-semibold">
                    Send us a message
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      type="text"
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="h-12 rounded-lg"
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="h-12 rounded-lg"
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="h-12 rounded-lg"
                    />
                    <Select
                      value={formData.inquiryType}
                      onValueChange={(value) =>
                        updateField("inquiryType", value)
                      }
                    >
                      <SelectTrigger className="h-12 rounded-lg">
                        <SelectValue placeholder="Inquiry Type *" />
                      </SelectTrigger>
                      <SelectContent>
                        {inquiryTypes.map((type) => (
                          <SelectItem
                            key={type}
                            value={type.toLowerCase().replace(/ /g, "-")}
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    placeholder="Your Message *"
                    value={formData.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    className="min-h-37.5 resize-none rounded-lg"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="from-rose to-electric-violet h-12 w-full rounded-full bg-linear-to-r text-white hover:opacity-90"
                  >
                    {isLoading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-foreground mb-6 text-xl font-semibold">
                  Get in Touch
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-rose/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                      <Mail className="text-rose h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-foreground mb-1 font-medium">
                        Email
                      </h3>
                      <a
                        href="mailto:customer.success@hmtcorporation.com"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        customer.success@hmtcorporation.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-electric-violet/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                      <Phone className="text-electric-violet h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-foreground mb-1 font-medium">
                        Phone
                      </h3>
                      <a
                        href="tel:0934640710"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        09 34 640 710
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-azure-radiance/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                      <Clock className="text-azure-radiance h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-foreground mb-1 font-medium">
                        Open Hours
                      </h3>
                      <p className="text-muted-foreground">
                        Monday - Friday: 8AM to 5PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-foreground mb-6 text-xl font-semibold">
                  Our Offices
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-gem/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                      <MapPin className="text-blue-gem h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-foreground mb-1 font-medium">
                        Headquarter
                      </h3>
                      <p className="text-muted-foreground">
                        01A Vong Duc, Hang Bai, Hoan Kiem, Ha Noi
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-rose/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                      <MapPin className="text-rose h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-foreground mb-1 font-medium">
                        Branch Office
                      </h3>
                      <p className="text-muted-foreground">
                        10th floor, Dreamplex, 195 Dien Bien Phu, Ward 15 Binh
                        Thanh Dist, HCMC
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
