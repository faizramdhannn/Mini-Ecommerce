'use client';

import { useState } from 'react';
import { Palette, Upload, Package, Send } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function CustomOrderPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    product_type: '',
    quantity: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast.success('Custom order request submitted! We will contact you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        product_type: '',
        quantity: '',
        description: '',
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Palette className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Custom Order</h1>
          <p className="text-gray-400 text-lg">
            Create your unique product with us
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold">1</span>
            </div>
            <h3 className="font-bold mb-1">Submit Request</h3>
            <p className="text-xs text-gray-400">Tell us your ideas</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="font-bold mb-1">Design Review</h3>
            <p className="text-xs text-gray-400">We create mockups</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="font-bold mb-1">Production</h3>
            <p className="text-xs text-gray-400">We make it real</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold">4</span>
            </div>
            <h3 className="font-bold mb-1">Delivery</h3>
            <p className="text-xs text-gray-400">Receive your order</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-black mb-6">Request Custom Order</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Your Name *"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              className="text-black"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email *"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Type *
                </label>
                <select
                  required
                  value={formData.product_type}
                  onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="bag">Bag</option>
                  <option value="laptop_sleeve">Laptop Sleeve</option>
                  <option value="messenger_bag">Messenger Bag</option>
                  <option value="sling_bag">Sling Bag</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Input
                label="Quantity *"
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="1"
                className="text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description & Requirements *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your custom product requirements: size, color, material, design, etc."
                rows={6}
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Include as much detail as possible. You can also upload reference images or designs after submitting this form.
              </p>
            </div>

            <Button type="submit" fullWidth isLoading={isSubmitting} size="lg">
              <Send className="w-5 h-5 mr-2" />
              Submit Request
            </Button>
          </form>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <Palette className="w-10 h-10 mx-auto mb-3" />
            <h3 className="font-bold mb-2">Your Design</h3>
            <p className="text-sm text-gray-400">Bring your ideas to life</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <Package className="w-10 h-10 mx-auto mb-3" />
            <h3 className="font-bold mb-2">Quality Materials</h3>
            <p className="text-sm text-gray-400">Premium quality guaranteed</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <Upload className="w-10 h-10 mx-auto mb-3" />
            <h3 className="font-bold mb-2">Fast Turnaround</h3>
            <p className="text-sm text-gray-400">2-4 weeks production</p>
          </div>
        </div>
      </div>
    </div>
  );
}