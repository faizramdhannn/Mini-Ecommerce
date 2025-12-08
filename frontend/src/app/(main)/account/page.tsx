'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { User, MapPin, ShoppingBag, LogOut, Edit, Plus, Home, Package, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/lib/store/auth.store';
import { orderService } from '@/lib/services/order.service';
import { formatDate, formatCurrency } from '@/lib/utils/format';
import { ORDER_STATUS } from '@/lib/utils/constants';
import { userService } from '@/lib/services/user.service';
import type { UserAddress, Order } from '@/types';
import toast from 'react-hot-toast';

type TabType = 'info' | 'addresses' | 'orders';

export default function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const tab = searchParams.get('tab');
    if (tab && ['info', 'addresses', 'orders'].includes(tab)) {
      setActiveTab(tab as TabType);
    }
  }, [isAuthenticated, router, searchParams]);

  useEffect(() => {
    if (activeTab === 'addresses' && addresses.length === 0) {
      loadAddresses();
    } else if (activeTab === 'orders' && orders.length === 0) {
      loadOrders();
    }
  }, [activeTab]);

  const loadAddresses = async () => {
    if (!user) return;
    setIsLoadingAddresses(true);
    try {
      const data = await userService.getUserAddresses(user.id);
      setAddresses(data);
    } catch (error) {
      console.error('Failed to load addresses:', error);
      setAddresses([]);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const response = await orderService.getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!user) return;
    
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    setDeletingAddressId(addressId);
    try {
      await userService.deleteAddress(user.id, addressId);
      toast.success('Address deleted successfully');
      setAddresses(addresses.filter(addr => addr.id !== addressId));
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete address');
    } finally {
      setDeletingAddressId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = ORDER_STATUS[status as keyof typeof ORDER_STATUS];
    const variantMap: Record<string, any> = {
      yellow: 'warning',
      blue: 'info',
      purple: 'info',
      green: 'success',
      red: 'danger',
    };
    return (
      <Badge variant={variantMap[statusConfig.color]}>
        {statusConfig.label}
      </Badge>
    );
  };

  if (!user) return null;

  const defaultAddress = addresses.find(addr => addr.is_default);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 sticky top-24">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-gray-500" />
              </div>
              <h2 className="text-black text-xl font-semibold mb-1">{user.nickname}</h2>
              <p className="text-gray-600 text-sm mb-4">{user.email}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/account/edit')}
                className="w-full mb-3"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            {defaultAddress && (
              <div className="border-t pt-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Home className="w-4 h-4 text-gray-600" />
                  <p className="text-sm font-medium text-gray-700">Default Address</p>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p className="font-medium text-black">{defaultAddress.recipient_name}</p>
                  <p className="line-clamp-2">{defaultAddress.address_line}</p>
                  <p>{defaultAddress.city}, {defaultAddress.province}</p>
                </div>
              </div>
            )}

            <Button
              variant="danger"
              fullWidth
              onClick={handleLogout}
              className="mt-4"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Right Column - Tabs Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg border">
            <div className="flex border-b">
              <button
                onClick={() => {
                  setActiveTab('info');
                  window.history.pushState(null, '', '/account?tab=info');
                }}
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition-colors ${
                  activeTab === 'info'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                Personal Info
              </button>
              <button
                onClick={() => {
                  setActiveTab('addresses');
                  window.history.pushState(null, '', '/account?tab=addresses');
                }}
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition-colors ${
                  activeTab === 'addresses'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                Addresses
              </button>
              <button
                onClick={() => {
                  setActiveTab('orders');
                  window.history.pushState(null, '', '/account?tab=orders');
                }}
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition-colors ${
                  activeTab === 'orders'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                Orders
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6">
              {/* Personal Info Tab */}
              {activeTab === 'info' && (
                <div>
                  <h3 className="text-lg text-black font-semibold mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nickname</label>
                      <p className="text-black mt-1">{user.nickname}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-black mt-1">{user.full_name || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-black mt-1">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-black mt-1">{user.phone || '-'}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-gray-500">Birthday</label>
                      <p className="text-black mt-1">
                        {user.birthday ? formatDate(user.birthday) : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Addresses Tab - Same as before */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg text-black font-semibold">My Addresses</h3>
                    <Button
                      size="sm"
                      onClick={() => router.push('/account/addresses/new')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New
                    </Button>
                  </div>

                  {isLoadingAddresses ? (
                    <div className="text-center py-12">
                      <Spinner size="lg" />
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No addresses saved yet</p>
                      <Button onClick={() => router.push('/account/addresses/new')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Address
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2 flex-1">
                              <h4 className="font-medium text-black">
                                {address.label || 'Address'}
                              </h4>
                              {address.is_default && (
                                <Badge variant="success">Default</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => router.push(`/account/addresses/${address.id}/edit`)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit address"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                disabled={deletingAddressId === address.id}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete address"
                              >
                                {deletingAddressId === address.id ? (
                                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p className="font-medium text-black">{address.recipient_name}</p>
                            <p>{address.phone}</p>
                            <p>{address.address_line}</p>
                            <p>
                              {address.city}, {address.province} {address.postal_code}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab - Same as before, just update links */}
              {activeTab === 'orders' && (
                <div>
                  <h3 className="text-lg text-black font-semibold mb-4">My Orders</h3>

                  {isLoadingOrders ? (
                    <div className="text-center py-12">
                      <Spinner size="lg" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
                      <Button onClick={() => router.push('/collections/all-product')}>
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          onClick={() => router.push(`/orders/${order.id}`)}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-semibold text-black">Order #{order.id}</p>
                              <p className="text-sm text-gray-500">
                                {formatDate(order.created_at)}
                              </p>
                            </div>
                            {getStatusBadge(order.status)}
                          </div>

                          <div className="mb-3">
                            {order.items.slice(0, 2).map((item) => (
                              <div key={item.id} className="flex items-center gap-3 mb-2">
                                {item.product?.media?.[0] && (
                                  <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                    <Image
                                      src={item.product.media[0].url}
                                      alt={item.product_name_snapshot}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-black line-clamp-1">
                                    {item.product_name_snapshot}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {item.quantity}x {formatCurrency(item.price_snapshot)}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <p className="text-xs text-gray-500 mt-2">
                                +{order.items.length - 2} more item(s)
                              </p>
                            )}
                          </div>

                          <div className="border-t pt-3 flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total</span>
                            <span className="font-bold text-black">
                              {formatCurrency(Number(order.total_amount) + Number(order.shipping_cost))}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}