'use client';

import { useState } from 'react';
import { Building2, Mail, Phone, Users, Send } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function CorporatePage() {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    employee_count: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Corporate inquiry submitted successfully! We will contact you soon.');
      setFormData({
        company_name: '',
        contact_name: '',
        email: '',
        phone: '',
        employee_count: '',
        message: '',
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Corporate Orders</h1>
          <p className="text-gray-400 text-lg">
            Special pricing and services for businesses
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-bold mb-2">Volume Discounts</h3>
            <p className="text-sm text-gray-400">Special pricing for bulk orders</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-bold mb-2">Custom Branding</h3>
            <p className="text-sm text-gray-400">Add your company logo</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">📦</div>
            <h3 className="font-bold mb-2">Flexible Delivery</h3>
            <p className="text-sm text-gray-400">Scheduled bulk deliveries</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-black mb-6">Get in Touch</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name *"
                type="text"
                required
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="PT. Your Company"
                className="text-black"
              />
              <Input
                label="Contact Person *"
                type="text"
                required
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                placeholder="John Doe"
                className="text-black"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email *"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="corporate@company.com"
                className="text-black"
              />
              <Input
                label="Phone Number *"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="08xxxxxxxxxx"
                className="text-black"
              />
            </div>

            <Input
              label="Number of Employees"
              type="text"
              value={formData.employee_count}
              onChange={(e) => setFormData({ ...formData, employee_count: e.target.value })}
              placeholder="50-100"
              className="text-black"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about your requirements..."
                rows={5}
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <Button type="submit" fullWidth isLoading={isSubmitting} size="lg">
              <Send className="w-5 h-5 mr-2" />
              Submit Inquiry
            </Button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center">
            <Mail className="w-8 h-8 mx-auto mb-2" />
            <h3 className="font-bold mb-1">Email</h3>
            <p className="text-sm text-gray-400">corporate@magadir.com</p>
          </div>
          <div className="text-center">
            <Phone className="w-8 h-8 mx-auto mb-2" />
            <h3 className="font-bold mb-1">Phone</h3>
            <p className="text-sm text-gray-400">+62 21 1234 5678</p>
          </div>
          <div className="text-center">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <h3 className="font-bold mb-1">WhatsApp</h3>
            <p className="text-sm text-gray-400">+62 812 3456 7890</p>
          </div>
        </div>
      </div>
    </div>
  );
}