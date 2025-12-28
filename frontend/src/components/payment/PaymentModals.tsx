"use client";

import { X, CreditCard as CreditCardIcon } from "lucide-react";
import { useState } from "react";

/* ================= TYPES ================= */
interface PaymentModalsProps {
  showBankTransfer: boolean;
  setShowBankTransfer: (v: boolean) => void;
  showEWallet: boolean;
  setShowEWallet: (v: boolean) => void;
  showCreditCard: boolean;
  setShowCreditCard: (v: boolean) => void;
}

interface CreditCardData {
  cardNumber: string;
  cardName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

/* ================= COMPONENT ================= */
export default function PaymentModals({
  showBankTransfer,
  setShowBankTransfer,
  showEWallet,
  setShowEWallet,
  showCreditCard,
  setShowCreditCard,
}: PaymentModalsProps) {
  const [cardData, setCardData] = useState<CreditCardData>({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  /* ================= E-WALLET ================= */
  const ewallets = [
    {
      id: "gopay",
      name: "GoPay",
      url: "https://www.gojek.com/gopay/",
      border: "hover:border-green-500",
    },
    {
      id: "ovo",
      name: "OVO",
      url: "https://www.ovo.id/",
      border: "hover:border-purple-500",
    },
    {
      id: "dana",
      name: "DANA",
      url: "https://www.dana.id/",
      border: "hover:border-blue-500",
    },
    {
      id: "shopeepay",
      name: "ShopeePay",
      url: "https://shopeepay.co.id/",
      border: "hover:border-orange-500",
    },
  ];

  const openEWallet = (url: string) => {
    setShowEWallet(false);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  /* ================= CREDIT CARD ================= */
  const formatCard = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const submitCard = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Simulasi submit kartu kredit");
  };

  return (
    <>
      {/* ================= BANK TRANSFER ================= */}
      {showBankTransfer && (
        <>
          <Overlay onClick={() => setShowBankTransfer(false)} />
          <Modal>
            <Header
              title="Transfer Bank"
              onClose={() => setShowBankTransfer(false)}
            />

            <div className="space-y-4">
              {[
                { bank: "BCA", no: "1234567890", color: "bg-blue-600" },
                { bank: "BNI", no: "0987654321", color: "bg-red-600" },
              ].map((b) => (
                <div key={b.bank} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-12 h-12 ${b.color} text-black flex items-center justify-center rounded font-bold`}
                    >
                      {b.bank}
                    </div>
                    <div>
                      <p className="font-semibold">Bank {b.bank}</p>
                      <p className="text-sm text-gray-500">
                        a.n. Magadir Store
                      </p>
                    </div>
                  </div>
                  <p className="bg-gray-50 p-3 rounded font-bold">{b.no}</p>
                </div>
              ))}

              <button
                onClick={() => setShowBankTransfer(false)}
                className="w-full bg-black text-white py-3 rounded-lg"
              >
                Saya Sudah Transfer
              </button>
            </div>
          </Modal>
        </>
      )}

      {/* ================= E-WALLET ================= */}
      {showEWallet && (
        <>
          <Overlay onClick={() => setShowEWallet(false)} />
          <Modal>
            <Header
              title="Pilih E-Wallet"
              onClose={() => setShowEWallet(false)}
            />

            <div className="space-y-3">
              {ewallets.map((e) => (
                <button
                  key={e.id}
                  onClick={() => openEWallet(e.url)}
                  className={`w-full p-4 border-2 text-black rounded-lg text-left transition hover:shadow ${e.border}`}
                >
                  {e.name}
                </button>
              ))}
            </div>

            <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded mt-4">
              💡 Akan dibuka di tab baru
            </p>
          </Modal>
        </>
      )}

      {/* ================= CREDIT CARD ================= */}
      {showCreditCard && (
        <>
          <Overlay onClick={() => setShowCreditCard(false)} />
          <Modal>
            <Header
              title="Kartu Kredit"
              onClose={() => setShowCreditCard(false)}
            />

            <form onSubmit={submitCard} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nomor Kartu</label>
                <div className="relative">
                  <input
                    value={cardData.cardNumber}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        cardNumber: formatCard(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="1234 5678 9012 3456"
                  />
                  <CreditCardIcon className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Nama Pemegang</label>
                <input
                  value={cardData.cardName}
                  onChange={(e) =>
                    setCardData({
                      ...cardData,
                      cardName: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg uppercase"
                  placeholder="JOHN DOE"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <input
                  placeholder="MM"
                  maxLength={2}
                  className="px-4 py-2 border rounded-lg"
                  onChange={(e) =>
                    setCardData({ ...cardData, expiryMonth: e.target.value })
                  }
                />
                <input
                  placeholder="YY"
                  maxLength={2}
                  className="px-4 py-2 border rounded-lg"
                  onChange={(e) =>
                    setCardData({ ...cardData, expiryYear: e.target.value })
                  }
                />
                <input
                  placeholder="CVV"
                  maxLength={3}
                  className="px-4 py-2 border rounded-lg"
                  onChange={(e) =>
                    setCardData({ ...cardData, cvv: e.target.value })
                  }
                />
              </div>

              <button className="w-full bg-black text-white py-3 rounded-lg">
                Bayar Sekarang
              </button>
            </form>
          </Modal>
        </>
      )}
    </>
  );
}

/* ================= UI ================= */
const Overlay = ({ onClick }: { onClick: () => void }) => (
  <div className="fixed inset-0 bg-black/50 z-40" onClick={onClick} />
);

const Modal = ({ children }: { children: React.ReactNode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg max-w-md w-full p-6">{children}</div>
  </div>
);

const Header = ({ title, onClose }: { title: string; onClose: () => void }) => (
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-xl text-black font-bold">{title}</h3>
    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
      <X className="w-5 h-5" />
    </button>
  </div>
);
