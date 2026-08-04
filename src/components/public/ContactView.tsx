import React, { useState } from 'react';
import { Send, Clock, Building2, Headphones } from 'lucide-react';
import { Card, Button, Input, Select, Badge } from '@ui-core';
import { Textarea } from '../ui/Textarea';
import { useToast } from '../ui/Toast';
import { useSEO } from '../../hooks/useSEO';

export const ContactView: React.FC = () => {
  useSEO({
    title: 'Contact Enterprise Sales & Technical Support | PromptImageLab',
    description: 'Connect with PromptImageLab technical teams for enterprise sales, OpsPilot ServiceNow integrations, Studio platform demos, and SLA support.',
    keywords: 'Contact PromptImageLab, AI enterprise sales, OpsPilot support, Studio support, ServiceNow AI demo'
  });

  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [inquiryType, setInquiryType] = useState('sales');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !workEmail) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast('Inquiry Submitted Successfully', {
        type: 'success',
        description: `Thank you ${fullName}. Our technical sales & engineering team will respond within 24 hours.`
      });
      setFullName('');
      setWorkEmail('');
      setCompanyName('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-20 py-12 px-6 sm:px-8 select-none animate-fadeIn bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* 1. HEADER */}
      <div className="text-center space-y-6 max-w-4xl mx-auto pt-6">
        <Badge variant="indigo" className="font-bold">Enterprise Communication Channels</Badge>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Contact Enterprise Technical Sales & Support
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Connect directly with our engineering and technical sales teams to discuss OpsPilot ServiceNow deployments, Studio multi-agent architectures, or custom REST API connectors.
        </p>
      </div>

      {/* 2. CONTACT OPTIONS & RESPONSE EXPECTATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-8 space-y-4 border-slate-200 dark:border-slate-800">
          <Building2 className="w-10 h-10 text-indigo-500" />
          <h3 className="text-2xl font-bold">Enterprise Sales</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Inquire about custom VPC deployments, enterprise licensing, or dedicated SLA contracts for OpsPilot and Studio.
          </p>
          <div className="text-xs font-bold text-indigo-500 font-mono">sales@promptimagelab.com</div>
        </Card>

        <Card className="p-8 space-y-4 border-slate-200 dark:border-slate-800">
          <Headphones className="w-10 h-10 text-emerald-500" />
          <h3 className="text-2xl font-bold">Technical Support</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Get assistance with ServiceNow connector configuration, BYOK vault setup, or multi-agent graph troubleshooting.
          </p>
          <div className="text-xs font-bold text-emerald-500 font-mono">support@promptimagelab.com</div>
        </Card>

        <Card className="p-8 space-y-4 border-slate-200 dark:border-slate-800">
          <Clock className="w-10 h-10 text-violet-500" />
          <h3 className="text-2xl font-bold">Response Expectations</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Enterprise sales and technical support inquiries are routed directly to on-duty engineers with guaranteed 24-hour initial response SLAs.
          </p>
          <div className="text-xs font-bold text-violet-500 font-mono">SLA: &lt; 24 Hours Response</div>
        </Card>
      </div>

      {/* 3. FORM & DETAIL SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        
        {/* Form Column (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="p-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
            <div>
              <h3 className="text-2xl font-bold">Submit a Technical Inquiry</h3>
              <p className="text-sm text-slate-500 mt-1">Please provide your details below.</p>
            </div>

            <form onSubmit={handleSubmitInquiry} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Full Name"
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <Input
                  label="Work Email"
                  type="email"
                  placeholder="jane@company.com"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Company Name"
                  placeholder="Enterprise Corp"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <Select
                  label="Inquiry Topic"
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  options={[
                    { value: 'sales', label: 'Enterprise Licensing & Demos' },
                    { value: 'opspilot', label: 'OpsPilot ServiceNow Connector' },
                    { value: 'studio', label: 'Studio Multi-Agent Architecture' },
                    { value: 'support', label: 'Technical Platform Support' },
                    { value: 'partnership', label: 'Partnership & Integration Requests' },
                  ]}
                />
              </div>

              <Textarea
                label="Technical Details or Requirements"
                rows={5}
                placeholder="Describe your current IT stack, ServiceNow environment, or AI prompt engineering requirements..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full h-12 text-base font-bold"
                isLoading={isSubmitting}
                leftIcon={<Send className="w-5 h-5" />}
              >
                Send Inquiry
              </Button>
            </form>
          </Card>
        </div>

        {/* Channels Information (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-8 border-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/20 space-y-4">
            <h4 className="font-bold text-lg text-indigo-600 dark:text-indigo-400">OpsPilot ServiceNow Onboarding</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Planning an enterprise deployment of OpsPilot to interface with ServiceNow incident management and CMDB tables? Contact sales to schedule an architecture review.
            </p>
          </Card>

          <Card className="p-8 border-violet-500/20 bg-violet-50/20 dark:bg-violet-950/20 space-y-4">
            <h4 className="font-bold text-lg text-violet-600 dark:text-violet-400">Studio Multi-Agent Demos</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Want a walkthrough of Studio's 8 collaborative agent roles, prompt evaluation engines, and JSON schema validators? Request a live technical demo.
            </p>
          </Card>
        </div>

      </div>
    </div>
  );
};
