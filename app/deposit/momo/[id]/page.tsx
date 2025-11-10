"use client";
import useScreenSize from '@/app/lib/useScreenSize';
import { useSession } from 'next-auth/react';
import NavBarMobile from '@/app/ui/mobile/navigation/nav-bar-mobile';
import { useState } from 'react';
import Image from 'next/image';

export default function MomoDepositPage() {
    const screenSize = useScreenSize();
    const { data: session } = useSession();
    return (
        <div className="flex flex-col min-h-screen">
            {screenSize === 'sm' ? <MobileMomoDeposit session={session} /> : <DesktopMomoDeposit session={session} />}
        </div>
    )
}

function MobileMomoDeposit({ session }: { session?: any }){
    const [amount, setAmount] = useState<string>('');
    
    const quickAmounts = [
        { label: '500.000 vnđ', value: '500000' },
        { label: '1.000.000 vnđ', value: '1000000' },
        { label: '2.000.000 vnđ', value: '2000000' },
        { label: '3.000.000 vnđ', value: '3000000' },
        { label: '5.000.000 vnđ', value: '5000000' },
        { label: '10.000.000 vnđ', value: '10000000' }
    ];

    const handleQuickSelect = (value: string) => {
        setAmount(value);
    };

    const handleContinue = () => {
        if (amount) {
            // Handle payment logic here
            console.log('Processing payment for amount:', amount);
        }
    };
    
    return(
        <div className="flex flex-col min-h-screen">
            <NavBarMobile displayNav={true} session={session} />
            
            <div className="flex-1 p-4 bg-gray-50">
                {/* Momo Payment UI starts here */}
                <div className="bg-white rounded-lg shadow-md p-6 mx-auto max-w-md">
                    {/* Title with Momo Logo */}
                    <div className="flex items-center justify-center mb-6">
                        <Image 
                            src="/icons/momo.svg" 
                            alt="Momo" 
                            width={40} 
                            height={40} 
                            className="mr-3"
                        />
                        <h1 className="text-xl font-semibold text-gray-800">
                            Thanh toán bằng ví Momo
                        </h1>
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-lg"
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
                                            ? 'bg-pink-500 text-white border-pink-500'
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
                        disabled={!amount || parseInt(amount) <= 0}
                        className="w-full bg-pink-500 text-white py-3 px-4 rounded-lg font-medium text-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-pink-600 transition-colors"
                    >
                        Tiếp tục
                    </button>
                </div>
            </div>
        </div>
    )
}

function DesktopMomoDeposit({ session }: { session?: any }){
    const [amount, setAmount] = useState<string>('');
    
    const quickAmounts = [
        { label: '500.000 vnđ', value: '500000' },
        { label: '1.000.000 vnđ', value: '1000000' },
        { label: '2.000.000 vnđ', value: '2000000' },
        { label: '3.000.000 vnđ', value: '3000000' },
        { label: '5.000.000 vnđ', value: '5000000' },
        { label: '10.000.000 vnđ', value: '10000000' }
    ];

    const handleQuickSelect = (value: string) => {
        setAmount(value);
    };

    const handleContinue = () => {
        if (amount) {
            // Handle payment logic here
            console.log('Processing payment for amount:', amount);
        }
    };
    
    return(
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex-grow flex flex-col items-center justify-center p-8">
                {/* Momo Payment UI starts here */}
                <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg">
                    {/* Title with Momo Logo */}
                    <div className="flex items-center justify-center mb-8">
                        <Image 
                            src="/icons/momo.svg" 
                            alt="Momo" 
                            width={48} 
                            height={48} 
                            className="mr-4"
                        />
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Thanh toán bằng ví Momo
                        </h1>
                    </div>

                    {/* Amount Input */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Nhập số tiền muốn nạp
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0"
                            className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-xl"
                            min="0"
                        />
                        {amount && (
                            <p className="text-sm text-gray-500 mt-2">
                                {parseInt(amount).toLocaleString('vi-VN')} VND
                            </p>
                        )}
                    </div>

                    {/* Quick Select */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                            Hoặc chọn nhanh
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {quickAmounts.map((item) => (
                                <button
                                    key={item.value}
                                    onClick={() => handleQuickSelect(item.value)}
                                    className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                                        amount === item.value
                                            ? 'bg-pink-500 text-white border-pink-500'
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
                        disabled={!amount || parseInt(amount) <= 0}
                        className="w-full bg-pink-500 text-white py-4 px-6 rounded-lg font-medium text-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-pink-600 transition-colors"
                    >
                        Tiếp tục
                    </button>
                </div>
            </div>
        </div>
    )
}