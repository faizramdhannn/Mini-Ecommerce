'use client';

import { useState } from 'react';
import { Package, Search, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface TrackingData {
  tracking_number: string;
  courier: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'delivered';
  current_location: string;
  estimated_delivery: string;
  history: {
    date: string;
    time: string;
    location: string;
    description: string;
    status: string;
  }[];
}

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      setError('Please enter tracking number');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      // Mock data
      setTrackingData({
        tracking_number: trackingNumber,
        courier: 'JNE',
        status: 'in_transit',
        current_location: 'Jakarta Distribution Center',
        estimated_delivery: '2025-12-20',
        history: [
          {
            date: '2025-12-18',
            time: '14:30',
            location: 'Jakarta Distribution Center',
            description: 'Package is in transit',
            status: 'in_transit'
          },
          {
            date: '2025-12-18',
            time: '10:15',
            location: 'Jakarta Sorting Center',
            description: 'Package has been sorted',
            status: 'sorted'
          },
          {
            date: '2025-12-17',
            time: '16:45',
            location: 'Bandung Origin',
            description: 'Package picked up by courier',
            status: 'picked_up'
          },
          {
            date: '2025-12-17',
            time: '14:00',
            location: 'Magadir Warehouse',
            description: 'Package prepared for shipping',
            status: 'prepared'
          }
        ]
      });
      setIsLoading(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'picked_up':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'in_transit':
        return 'In Transit';
      case 'picked_up':
        return 'Picked Up';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Track Your Shipment</h1>
          <p className="text-gray-400 text-lg">
            Enter your tracking number to check your order status
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg p-8 mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter tracking number (e.g., JNE1234567890)"
                value={trackingNumber}
                onChange={(e) => {
                  setTrackingNumber(e.target.value);
                  setError('');
                }}
                className="text-black pr-12"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <Button type="submit" fullWidth isLoading={isLoading} size="lg">
              <Search className="w-5 h-5 mr-2" />
              Track Package
            </Button>
          </form>
        </div>

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {trackingData.tracking_number}
                  </h2>
                  <p className="text-gray-600">Courier: {trackingData.courier}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(trackingData.status)}`}>
                  {getStatusText(trackingData.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Current Location</p>
                    <p className="font-semibold text-gray-900">{trackingData.current_location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Estimated Delivery</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(trackingData.estimated_delivery).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Shipment History</h3>
              
              <div className="space-y-6">
                {trackingData.history.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-blue-600' : 'bg-gray-300'
                      }`}>
                        {index === 0 ? (
                          <Truck className="w-5 h-5 text-white" />
                        ) : (
                          <div className="w-3 h-3 bg-white rounded-full" />
                        )}
                      </div>
                      {index < trackingData.history.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-300 my-2" />
                      )}
                    </div>

                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-900">{item.description}</p>
                        <span className="text-sm text-gray-500">{item.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{item.location}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.date).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mt-8">
          <h3 className="font-bold mb-2">Need Help?</h3>
          <p className="text-sm text-gray-400 mb-4">
            If you have any questions about your shipment, please contact our customer service.
          </p>
          <div className="flex gap-4">
            <a href="mailto:support@magadir.com" className="text-sm text-blue-400 hover:underline">
              support@magadir.com
            </a>
            <span className="text-gray-600">|</span>
            <a href="tel:+622112345678" className="text-sm text-blue-400 hover:underline">
              +62 21 1234 5678
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}