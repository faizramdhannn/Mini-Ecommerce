'use client';

import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

export default function StoresPage() {
  const stores = [
    {
      id: 1,
      name: 'Magadir Bandung',
      address: 'Jl. Cihampelas No. 123, Bandung',
      phone: '+62 22 1234 5678',
      hours: '10:00 - 22:00 WIB',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
      maps: 'https://share.google/WkZgPeyRECTd5D5Rl',
    },
    {
      id: 2,
      name: 'Magadir Jakarta',
      address: 'Jl. Sudirman No. 456, Jakarta',
      phone: '+62 21 9876 5432',
      hours: '10:00 - 22:00 WIB',
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80',
      maps: 'https://share.google/bvuWqIm04jo30RvY6',
    },
    {
      id: 3,
      name: 'Magadir Surabaya',
      address: 'Jl. Tunjungan No. 789, Surabaya',
      phone: '+62 31 5555 6666',
      hours: '10:00 - 22:00 WIB',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
      maps: 'https://share.google/Wumq3NP0mqDTzaYVw',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Stores
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Visit our physical stores to experience our products firsthand
          </p>
        </div>

        {/* Store List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={store.image}
                  alt={store.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {store.name}
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">{store.address}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <a href={`tel:${store.phone}`} className="text-sm text-gray-700 hover:text-black">
                      {store.phone}
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{store.hours}</p>
                  </div>
                </div>

                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => window.open(store.maps, '_blank')}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Can't find a store near you?</h2>
          <p className="text-gray-400 mb-6">
            Contact us and we'll help you find the nearest Magadir store or arrange a special visit
          </p>
          <Button onClick={() => window.location.href = 'mailto:stores@magadir.com'}>
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
}