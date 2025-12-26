"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/auth.store";
import { cartService } from "@/lib/services/cart.service";
import { userService } from "@/lib/services/user.service";
import { orderService } from "@/lib/services/order.service";
import { voucherService } from "@/lib/services/voucher.service";
import type { Cart, UserAddress } from "@/types";
import type { Voucher } from "@/types/voucher";
import { toast } from "react-hot-toast";
import { MapPin, Plus, CreditCard, Tag, X, Loader2, Check } from "lucide-react";
import PaymentModals from "@/components/payment/PaymentModals";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [cart, setCart] = useState<Cart | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ⭐ Voucher States
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [freeShipping, setFreeShipping] = useState(false);

  // ⭐ Voucher List Modal
  const [showVoucherList, setShowVoucherList] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);

  // ⭐ Payment Modal States
  const [showBankTransfer, setShowBankTransfer] = useState(false);
  const [showEWallet, setShowEWallet] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }

    fetchCart();
    fetchAddresses();
  }, [user, router]);

  const fetchCart = async () => {
    try {
      setIsLoadingCart(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Gagal memuat keranjang");
    } finally {
      setIsLoadingCart(false);
    }
  };

  const fetchAddresses = async () => {
    if (!user) return;

    try {
      setIsLoadingAddresses(true);
      const data = await userService.getUserAddresses(user.id);
      setAddresses(data);

      const defaultAddress = data.find((addr) => addr.is_default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      } else if (data.length > 0) {
        setSelectedAddress(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  // ⭐ Load Available Vouchers
  const loadAvailableVouchers = async () => {
    setIsLoadingVouchers(true);
    try {
      const vouchers = await voucherService.getAvailableVouchers();
      setAvailableVouchers(vouchers);
    } catch (error) {
      console.error("Error loading vouchers:", error);
    } finally {
      setIsLoadingVouchers(false);
    }
  };

  // ⭐ Open Voucher List Modal
  const handleOpenVoucherList = () => {
    setShowVoucherList(true);
    loadAvailableVouchers();
  };

  // ⭐ Select Voucher from List
  const handleSelectVoucher = async (voucher: Voucher) => {
    setIsApplyingVoucher(true);
    try {
      const totals = calculateTotals();
      const result = await voucherService.applyVoucher({
        code: voucher.code,
        subtotal: totals.subtotal,
      });

      if (result.valid && result.voucher) {
        setAppliedVoucher(result.voucher);
        setVoucherCode(result.voucher.code);
        setVoucherDiscount(result.discount_amount || 0);
        setFreeShipping(result.free_shipping || false);
        setShowVoucherList(false);
        toast.success("Voucher berhasil diterapkan!");
      } else {
        toast.error(result.message || "Kode voucher tidak valid");
      }
    } catch (error: any) {
      console.error("Error applying voucher:", error);
      toast.error(error.response?.data?.message || "Gagal menerapkan voucher");
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const calculateTotals = () => {
    if (!cart?.items)
      return { subtotal: 0, shipping: 0, discount: 0, total: 0 };

    const subtotal = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    const shipping = freeShipping ? 0 : 20000;
    const discount = voucherDiscount;
    const total = subtotal + shipping - discount;

    return { subtotal, shipping, discount, total };
  };

  // ⭐ Apply Voucher Handler
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      toast.error("Masukkan kode voucher");
      return;
    }

    setIsApplyingVoucher(true);
    try {
      const totals = calculateTotals();
      const result = await voucherService.applyVoucher({
        code: voucherCode.trim().toUpperCase(),
        subtotal: totals.subtotal,
      });

      if (result.valid && result.voucher) {
        setAppliedVoucher(result.voucher);
        setVoucherDiscount(result.discount_amount || 0);
        setFreeShipping(result.free_shipping || false);
        toast.success("Voucher berhasil diterapkan!");
      } else {
        toast.error(result.message || "Kode voucher tidak valid");
        setVoucherCode("");
      }
    } catch (error: any) {
      console.error("Error applying voucher:", error);
      toast.error(error.response?.data?.message || "Gagal menerapkan voucher");
      setVoucherCode("");
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  // ⭐ Remove Voucher Handler
  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode("");
    setVoucherDiscount(0);
    setFreeShipping(false);
    toast.success("Voucher dihapus");
  };

  const handleSubmitOrder = async () => {
    if (!selectedAddress) {
      toast.error("Pilih alamat pengiriman");
      return;
    }

    if (!paymentMethod) {
      toast.error("Pilih metode pembayaran");
      return;
    }

    if (!cart?.items || cart.items.length === 0) {
      toast.error("Keranjang kosong");
      return;
    }

    // ⭐ Show payment modal for bank_transfer or e_wallet
    if (paymentMethod === "bank_transfer") {
      setShowBankTransfer(true);
      return;
    }

    if (paymentMethod === "e_wallet") {
      setShowEWallet(true);
      return;
    }

    // For other payment methods (COD, Credit Card), proceed directly
    try {
      setIsSubmitting(true);
      const totals = calculateTotals();

      const orderData = {
        items: cart.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        payment_method: paymentMethod,
        shipping_cost: totals.shipping,
        address_id: selectedAddress,
        voucher_code: appliedVoucher?.code,
      };

      const order = await orderService.createOrder(orderData);
      toast.success("Pesanan berhasil dibuat!");
      router.push(`/account?tab=orders`);
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(error.response?.data?.message || "Gagal membuat pesanan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totals = calculateTotals();

  if (!user) return null;

  if (isLoadingCart || isLoadingAddresses) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat checkout...</p>
        </div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-900 mb-4">Keranjang Anda kosong</p>
          <button
            onClick={() => router.push("/products")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Belanja Sekarang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Alamat Pengiriman
                  </h2>
                </div>
                <button
                  onClick={() =>
                    router.push("/account/addresses/new?redirect=/checkout")
                  }
                  className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Baru</span>
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Belum ada alamat</p>
                  <button
                    onClick={() =>
                      router.push("/account/addresses/new?redirect=/checkout")
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Tambah Alamat
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedAddress === address.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={selectedAddress === address.id}
                          onChange={() => setSelectedAddress(address.id)}
                          className="mt-1 mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-gray-900">
                              {address.recipient_name}
                            </span>
                            {address.is_default && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {address.phone}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {address.address_line}, {address.city},{" "}
                            {address.province} {address.postal_code}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Metode Pembayaran
                </h2>
              </div>

              <div className="space-y-3">
                {/* ⭐ Added Credit Card */}
                {["credit_card", "bank_transfer", "e_wallet", "cod"].map(
                  (method) => (
                    <label
                      key={method}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === method
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="payment"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <span className="font-semibold text-gray-900">
                            {method === "credit_card" && "Kartu Kredit"}
                            {method === "bank_transfer" && "Transfer Bank"}
                            {method === "e_wallet" && "E-Wallet"}
                            {method === "cod" && "Cash on Delivery (COD)"}
                          </span>
                          <p className="text-sm text-gray-600">
                            {method === "credit_card" &&
                              "Visa, Mastercard, JCB"}
                            {method === "bank_transfer" &&
                              "BCA, Mandiri, BNI, BRI"}
                            {method === "e_wallet" &&
                              "GoPay, OVO, DANA, ShopeePay"}
                            {method === "cod" && "Bayar saat barang diterima"}
                          </p>
                        </div>
                      </div>
                    </label>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Ringkasan Pesanan
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={
                          item.product.media?.[0]?.url ||
                          "/placeholder-product.png"
                        }
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        Rp{" "}
                        {(item.product.price * item.quantity).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ⭐ Voucher Section with List */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  Kode Voucher
                </h3>

                {appliedVoucher ? (
                  // Voucher Applied State
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-500 rounded-full p-1">
                          <Tag className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-green-900">
                            {appliedVoucher.code}
                          </p>
                          <p className="text-xs text-green-700 mt-1">
                            {appliedVoucher.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveVoucher}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Hapus voucher"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {voucherDiscount > 0 && (
                      <p className="text-sm font-semibold text-green-700 mt-2">
                        Diskon: -Rp {voucherDiscount.toLocaleString("id-ID")}
                      </p>
                    )}
                    {freeShipping && (
                      <p className="text-sm font-semibold text-green-700">
                        ✓ Gratis Ongkir
                      </p>
                    )}
                  </div>
                ) : (
                  // Voucher Input State
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) =>
                          setVoucherCode(e.target.value.toUpperCase())
                        }
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleApplyVoucher();
                          }
                        }}
                        placeholder="Masukkan kode voucher"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                        disabled={isApplyingVoucher}
                      />
                      <button
                        onClick={handleApplyVoucher}
                        disabled={!voucherCode.trim() || isApplyingVoucher}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                      >
                        {isApplyingVoucher ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Pakai"
                        )}
                      </button>
                    </div>

                    {/* ⭐ Show Available Vouchers Button */}
                    <button
                      onClick={handleOpenVoucherList}
                      className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1 py-2"
                    >
                      <Tag className="w-4 h-4" />
                      Lihat Voucher Tersedia
                    </button>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({cart.items.length} items)
                  </span>
                  <span className="text-gray-900 font-medium">
                    Rp {totals.subtotal.toLocaleString("id-ID")}
                  </span>
                </div>

                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold text-sm">
                    <span>Diskon Voucher</span>
                    <span>-Rp {voucherDiscount.toLocaleString("id-ID")}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ongkir</span>
                  {freeShipping ? (
                    <span className="text-green-600 font-semibold">GRATIS</span>
                  ) : (
                    <span className="text-gray-900 font-medium">
                      Rp {totals.shipping.toLocaleString("id-ID")}
                    </span>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                      Rp {totals.total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting || !selectedAddress || !paymentMethod}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Buat Pesanan"
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Dengan membuat pesanan, Anda menyetujui Syarat & Ketentuan kami
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ⭐ Voucher List Modal */}
      {showVoucherList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                Voucher Tersedia
              </h3>
              <button
                onClick={() => setShowVoucherList(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {isLoadingVouchers ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
                  <p className="text-gray-600">Memuat voucher...</p>
                </div>
              ) : availableVouchers.length === 0 ? (
                <div className="text-center py-8">
                  <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Tidak ada voucher tersedia</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableVouchers.map((voucher) => {
                    const isEligible =
                      !voucher.min_purchase ||
                      totals.subtotal >= voucher.min_purchase;

                    return (
                      <div
                        key={voucher.id}
                        className={`border-2 rounded-lg p-4 ${
                          isEligible
                            ? "border-gray-200 hover:border-blue-300 cursor-pointer"
                            : "border-gray-200 bg-gray-50 opacity-50"
                        }`}
                        onClick={() =>
                          isEligible && handleSelectVoucher(voucher)
                        }
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3 flex-1">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                voucher.type === "FREE_SHIPPING"
                                  ? "bg-green-100"
                                  : "bg-blue-100"
                              }`}
                            >
                              <Tag
                                className={`w-6 h-6 ${
                                  voucher.type === "FREE_SHIPPING"
                                    ? "text-green-600"
                                    : "text-blue-600"
                                }`}
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900 mb-1">
                                {voucher.name}
                              </h5>
                              <p className="text-sm text-gray-600 mb-2">
                                {voucher.description}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded font-mono font-bold">
                                  {voucher.code}
                                </span>
                                {voucher.discount_amount && (
                                  <span className="text-sm font-semibold text-gray-900">
                                    Diskon Rp{" "}
                                    {voucher.discount_amount.toLocaleString(
                                      "id-ID"
                                    )}
                                  </span>
                                )}
                                {voucher.type === "FREE_SHIPPING" && (
                                  <span className="text-sm font-semibold text-green-600">
                                    GRATIS ONGKIR
                                  </span>
                                )}
                              </div>
                              {voucher.min_purchase && (
                                <p className="text-xs text-gray-500 mt-2">
                                  Min. belanja: Rp{" "}
                                  {voucher.min_purchase.toLocaleString("id-ID")}
                                </p>
                              )}
                              {!isEligible && (
                                <p className="text-xs text-red-600 mt-1">
                                  Belum mencapai minimum pembelian
                                </p>
                              )}
                            </div>
                          </div>
                          {isEligible && (
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                              Pakai
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ⭐ Payment Modals */}
      <PaymentModals
        showBankTransfer={showBankTransfer}
        setShowBankTransfer={setShowBankTransfer}
        showEWallet={showEWallet}
        setShowEWallet={setShowEWallet}
        onSelectEWallet={(provider) => {
          // Handle e-wallet provider selection
          console.log("Selected provider:", provider);
          // You can add additional logic here
        }}
      />
    </div>
  );
}
