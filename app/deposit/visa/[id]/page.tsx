"use client";
import useScreenSize from '@/app/lib/useScreenSize';
import { useSession } from 'next-auth/react';
import NavBarMobile from '@/app/ui/mobile/navigation/nav-bar-mobile';
import { useState } from 'react';
import Image from 'next/image';

export default function VisaDepositPage() {
    const screenSize = useScreenSize();
    const { data: session } = useSession();
    return (
        <div className="flex flex-col min-h-screen">
            {screenSize === 'sm' ? <MobileVisaDeposit session={session} /> : <DesktopVisaDeposit session={session} />}
        </div>
    )
}

function MobileVisaDeposit({ session }: { session?: any }){
    const [amount, setAmount] = useState<string>('');
    const [selectedCard, setSelectedCard] = useState<string>('');
    const [cardNumber, setCardNumber] = useState<string>('');
    const [expiryDate, setExpiryDate] = useState<string>('');
    const [cvv, setCvv] = useState<string>('');
    const [cardHolder, setCardHolder] = useState<string>('');
    
    const quickAmounts = [
        { label: '500.000 vnđ', value: '500000' },
        { label: '1.000.000 vnđ', value: '1000000' },
        { label: '2.000.000 vnđ', value: '2000000' },
        { label: '3.000.000 vnđ', value: '3000000' },
        { label: '5.000.000 vnđ', value: '5000000' },
        { label: '10.000.000 vnđ', value: '10000000' }
    ];

    const cardTypes = [
        { name: 'Visa', code: 'VISA', logo: '/icons/cards/visa.svg' },
        { name: 'Mastercard', code: 'MASTERCARD', logo: '/icons/cards/mastercard.svg' },
        { name: 'JCB', code: 'JCB', logo: '/icons/cards/jcb.svg' },
        { name: 'American Express', code: 'AMEX', logo: '/icons/cards/amex.svg' }
    ];

    const handleQuickSelect = (value: string) => {
        setAmount(value);
    };

    const handleCardSelect = (cardCode: string) => {
        setSelectedCard(cardCode);
    };

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiryDate = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.slice(0, 2) + '/' + v.slice(2, 4);
        }
        return v;
    };

    const handleContinue = () => {
        if (amount && selectedCard && cardNumber && expiryDate && cvv && cardHolder) {
            // Handle visa payment logic here
            console.log('Processing visa payment:', { 
                amount, 
                cardType: selectedCard, 
                cardNumber: cardNumber.replace(/\s/g, ''),
                expiryDate,
                cvv,
                cardHolder
            });
        }
    };

    const isFormValid = amount && selectedCard && cardNumber.replace(/\s/g, '').length >= 13 && 
                       expiryDate.length === 5 && cvv.length >= 3 && cardHolder.trim();
    
    return(
        <div className="flex flex-col min-h-screen">
            <NavBarMobile displayNav={true} session={session} />
            
            <div className="flex-1 p-4 bg-gray-50">
                {/* Visa Payment UI starts here */}
                <div className="bg-white rounded-lg shadow-md p-6 mx-auto max-w-md">
                    {/* Title with Card Icon */}
                    <div className="flex items-center justify-center mb-6">
                        <Image 
                            src="/icons/visa.svg" 
                            alt="Credit Card" 
                            width={40} 
                            height={40} 
                            className="mr-3"
                        />
                        <h1 className="text-xl font-semibold text-gray-800">
                            Thanh toán bằng thẻ
                        </h1>
                    </div>

                    {/* Card Type Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Chọn loại thẻ
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {cardTypes.map((card) => (
                                <button
                                    key={card.code}
                                    onClick={() => handleCardSelect(card.code)}
                                    className={`flex items-center p-3 border rounded-lg transition-colors ${
                                        selectedCard === card.code
                                            ? 'bg-green-500 text-white border-green-500'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <Image 
                                        src={card.logo} 
                                        alt={card.name} 
                                        width={24} 
                                        height={24} 
                                        className="mr-2"
                                    />
                                    <span className="text-sm font-medium">{card.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Card Information */}
                    <div className="mb-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số thẻ
                            </label>
                            <input
                                type="text"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                placeholder="1234 5678 9012 3456"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                maxLength={19}
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    MM/YY
                                </label>
                                <input
                                    type="text"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                                    placeholder="MM/YY"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    maxLength={5}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    CVV
                                </label>
                                <input
                                    type="text"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="123"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    maxLength={4}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên chủ thẻ
                            </label>
                            <input
                                type="text"
                                value={cardHolder}
                                onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                                placeholder="NGUYEN VAN A"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nhập số tiền muốn nạp
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                            min="0"
                        />
                        {amount && (
                            <p className="text-sm text-gray-500 mt-1">
                                {parseInt(amount).toLocaleString('vi-VN')} VND
                            </p>
                        )}
                    </div>

                    {/* Quick Select */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Hoặc chọn nhanh
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {quickAmounts.map((item) => (
                                <button
                                    key={item.value}
                                    onClick={() => handleQuickSelect(item.value)}
                                    className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                                        amount === item.value
                                            ? 'bg-green-500 text-white border-green-500'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Continue Button */}
                    <button
                        onClick={handleContinue}
                        disabled={!isFormValid}
                        className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium text-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
                    >
                        Tiếp tục thanh toán
                    </button>

                    {/* Security Info */}
                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                        <h3 className="font-medium text-green-800 mb-2">Bảo mật thanh toán</h3>
                        <p className="text-sm text-green-600">
                            Thông tin thẻ của bạn được mã hóa và bảo mật tuyệt đối. Chúng tôi không lưu trữ thông tin thẻ.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function DesktopVisaDeposit({ session }: { session?: any }){
    const [amount, setAmount] = useState<string>('');
    const [selectedCard, setSelectedCard] = useState<string>('');
    const [cardNumber, setCardNumber] = useState<string>('');
    const [expiryDate, setExpiryDate] = useState<string>('');
    const [cvv, setCvv] = useState<string>('');
    const [cardHolder, setCardHolder] = useState<string>('');
    
    const quickAmounts = [
        { label: '500.000 vnđ', value: '500000' },
        { label: '1.000.000 vnđ', value: '1000000' },
        { label: '2.000.000 vnđ', value: '2000000' },
        { label: '3.000.000 vnđ', value: '3000000' },
        { label: '5.000.000 vnđ', value: '5000000' },
        { label: '10.000.000 vnđ', value: '10000000' }
    ];

    const cardTypes = [
        { name: 'Visa', code: 'VISA', logo: '/icons/cards/visa.svg' },
        { name: 'Mastercard', code: 'MASTERCARD', logo: '/icons/cards/mastercard.svg' },
        { name: 'JCB', code: 'JCB', logo: '/icons/cards/jcb.svg' },
        { name: 'American Express', code: 'AMEX', logo: '/icons/cards/amex.svg' }
    ];

    const handleQuickSelect = (value: string) => {
        setAmount(value);
    };

    const handleCardSelect = (cardCode: string) => {
        setSelectedCard(cardCode);
    };

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiryDate = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.slice(0, 2) + '/' + v.slice(2, 4);
        }
        return v;
    };

    const handleContinue = () => {
        if (amount && selectedCard && cardNumber && expiryDate && cvv && cardHolder) {
            // Handle visa payment logic here
            console.log('Processing visa payment:', { 
                amount, 
                cardType: selectedCard, 
                cardNumber: cardNumber.replace(/\s/g, ''),
                expiryDate,
                cvv,
                cardHolder
            });
        }
    };

    const isFormValid = amount && selectedCard && cardNumber.replace(/\s/g, '').length >= 13 && 
                       expiryDate.length === 5 && cvv.length >= 3 && cardHolder.trim();
    
    return(
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex-grow flex flex-col items-center justify-center p-8">
                {/* Visa Payment UI starts here */}
                <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl">
                    {/* Title with Card Icon */}
                    <div className="flex items-center justify-center mb-8">
                        <Image 
                            src="/icons/credit-card.svg" 
                            alt="Credit Card" 
                            width={48} 
                            height={48} 
                            className="mr-4"
                        />
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Thanh toán bằng thẻ
                        </h1>
                    </div>

                    {/* Card Type Selection */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                            Chọn loại thẻ
                        </label>
                        <div className="grid grid-cols-4 gap-4">
                            {cardTypes.map((card) => (
                                <button
                                    key={card.code}
                                    onClick={() => handleCardSelect(card.code)}
                                    className={`flex flex-col items-center p-4 border rounded-lg transition-colors ${
                                        selectedCard === card.code
                                            ? 'bg-green-500 text-white border-green-500'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <Image 
                                        src={card.logo} 
                                        alt={card.name} 
                                        width={32} 
                                        height={32} 
                                        className="mb-2"
                                    />
                                    <span className="text-sm font-medium text-center">{card.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        {/* Card Information */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-medium text-gray-800">Thông tin thẻ</h2>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số thẻ
                                </label>
                                <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                    placeholder="1234 5678 9012 3456"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    maxLength={19}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        MM/YY
                                    </label>
                                    <input
                                        type="text"
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                                        placeholder="MM/YY"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        maxLength={5}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                                        placeholder="123"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        maxLength={4}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên chủ thẻ
                                </label>
                                <input
                                    type="text"
                                    value={cardHolder}
                                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                                    placeholder="NGUYEN VAN A"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>

                        {/* Amount and Quick Select */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-medium text-gray-800">Số tiền</h2>
                            
                            {/* Amount Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nhập số tiền muốn nạp
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0"
                                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xl"
                                    min="0"
                                />
                                {amount && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        {parseInt(amount).toLocaleString('vi-VN')} VND
                                    </p>
                                )}
                            </div>

                            {/* Quick Select */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Hoặc chọn nhanh
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {quickAmounts.map((item) => (
                                        <button
                                            key={item.value}
                                            onClick={() => handleQuickSelect(item.value)}
                                            className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                                                amount === item.value
                                                    ? 'bg-green-500 text-white border-green-500'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Info */}
                    <div className="mt-8 mb-6 p-4 bg-green-50 rounded-lg">
                        <h3 className="font-medium text-green-800 mb-2">Bảo mật thanh toán</h3>
                        <p className="text-sm text-green-600">
                            Thông tin thẻ của bạn được mã hóa và bảo mật tuyệt đối. Chúng tôi không lưu trữ thông tin thẻ.
                        </p>
                    </div>

                    {/* Continue Button */}
                    <button
                        onClick={handleContinue}
                        disabled={!isFormValid}
                        className="w-full bg-green-500 text-white py-4 px-6 rounded-lg font-medium text-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
                    >
                        Tiếp tục thanh toán
                    </button>
                </div>
            </div>
        </div>
    )
}