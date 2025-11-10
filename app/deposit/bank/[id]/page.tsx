"use client";
import useScreenSize from '@/app/lib/useScreenSize';
import { useSession } from 'next-auth/react';
import NavBarMobile from '@/app/ui/mobile/navigation/nav-bar-mobile';
import { useState } from 'react';
import Image from 'next/image';

export default function BankDepositPage() {
    const screenSize = useScreenSize();
    const { data: session } = useSession();
    return (
        <div className="flex flex-col min-h-screen">
            {screenSize === 'sm' ? <MobileBankDeposit session={session} /> : <DesktopBankDeposit session={session} />}
        </div>
    )
}

function MobileBankDeposit({ session }: { session?: any }){
    const [amount, setAmount] = useState<string>('');
    const [selectedBank, setSelectedBank] = useState<string>('');
    
    const quickAmounts = [
        { label: '500.000 vnđ', value: '500000' },
        { label: '1.000.000 vnđ', value: '1000000' },
        { label: '2.000.000 vnđ', value: '2000000' },
        { label: '3.000.000 vnđ', value: '3000000' },
        { label: '5.000.000 vnđ', value: '5000000' },
        { label: '10.000.000 vnđ', value: '10000000' }
    ];

    const banks = [
        { name: 'Vietcombank', code: 'VCB', logo: '/icons/banks/vcb.svg' },
        { name: 'Techcombank', code: 'TCB', logo: '/icons/banks/tcb.svg' },
        { name: 'BIDV', code: 'BIDV', logo: '/icons/banks/bidv.svg' },
        { name: 'VietinBank', code: 'VTB', logo: '/icons/banks/vtb.svg' },
        { name: 'ACB', code: 'ACB', logo: '/icons/banks/acb.svg' },
        { name: 'Sacombank', code: 'STB', logo: '/icons/banks/stb.svg' }
    ];

    const handleQuickSelect = (value: string) => {
        setAmount(value);
    };

    const handleBankSelect = (bankCode: string) => {
        setSelectedBank(bankCode);
    };

    const handleContinue = () => {
        if (amount && selectedBank) {
            // Handle bank payment logic here
            console.log('Processing bank payment:', { amount, bank: selectedBank });
        }
    };
    
    return(
        <div className="flex flex-col min-h-screen">
            <NavBarMobile displayNav={true} session={session} />
            
            <div className="flex-1 p-4 bg-gray-50">
                {/* Bank Payment UI starts here */}
                <div className="bg-white rounded-lg shadow-md p-6 mx-auto max-w-md">
                    {/* Title with Bank Icon */}
                    <div className="flex items-center justify-center mb-6">
                        <Image 
                            src="/icons/bank.svg" 
                            alt="Bank" 
                            width={40} 
                            height={40} 
                            className="mr-3"
                        />
                        <h1 className="text-xl font-semibold text-gray-800">
                            Thanh toán qua ngân hàng
                        </h1>
                    </div>

                    {/* Bank Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Chọn ngân hàng
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {banks.map((bank) => (
                                <button
                                    key={bank.code}
                                    onClick={() => handleBankSelect(bank.code)}
                                    className={`flex items-center p-3 border rounded-lg transition-colors ${
                                        selectedBank === bank.code
                                            ? 'bg-blue-500 text-white border-blue-500'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <Image 
                                        src={bank.logo} 
                                        alt={bank.name} 
                                        width={24} 
                                        height={24} 
                                        className="mr-2"
                                    />
                                    <span className="text-sm font-medium">{bank.name}</span>
                                </button>
                            ))}
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
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
                                            ? 'bg-blue-500 text-white border-blue-500'
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
                        disabled={!amount || parseInt(amount) <= 0 || !selectedBank}
                        className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium text-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                    >
                        Tiếp tục
                    </button>

                    {/* Bank Transfer Info */}
                    {selectedBank && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-medium text-blue-800 mb-2">Thông tin chuyển khoản</h3>
                            <p className="text-sm text-blue-600">
                                Sau khi nhấn "Tiếp tục", bạn sẽ được chuyển đến trang thanh toán của {banks.find(b => b.code === selectedBank)?.name}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function DesktopBankDeposit({ session }: { session?: any }){
    const [amount, setAmount] = useState<string>('');
    const [selectedBank, setSelectedBank] = useState<string>('');
    
    const quickAmounts = [
        { label: '500.000 vnđ', value: '500000' },
        { label: '1.000.000 vnđ', value: '1000000' },
        { label: '2.000.000 vnđ', value: '2000000' },
        { label: '3.000.000 vnđ', value: '3000000' },
        { label: '5.000.000 vnđ', value: '5000000' },
        { label: '10.000.000 vnđ', value: '10000000' }
    ];

    const banks = [
        { name: 'Vietcombank', code: 'VCB', logo: '/icons/banks/vcb.svg' },
        { name: 'Techcombank', code: 'TCB', logo: '/icons/banks/tcb.svg' },
        { name: 'BIDV', code: 'BIDV', logo: '/icons/banks/bidv.svg' },
        { name: 'VietinBank', code: 'VTB', logo: '/icons/banks/vtb.svg' },
        { name: 'ACB', code: 'ACB', logo: '/icons/banks/acb.svg' },
        { name: 'Sacombank', code: 'STB', logo: '/icons/banks/stb.svg' }
    ];

    const handleQuickSelect = (value: string) => {
        setAmount(value);
    };

    const handleBankSelect = (bankCode: string) => {
        setSelectedBank(bankCode);
    };

    const handleContinue = () => {
        if (amount && selectedBank) {
            // Handle bank payment logic here
            console.log('Processing bank payment:', { amount, bank: selectedBank });
        }
    };
    
    return(
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex-grow flex flex-col items-center justify-center p-8">
                {/* Bank Payment UI starts here */}
                <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
                    {/* Title with Bank Icon */}
                    <div className="flex items-center justify-center mb-8">
                        <Image 
                            src="/icons/bank.svg" 
                            alt="Bank" 
                            width={48} 
                            height={48} 
                            className="mr-4"
                        />
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Thanh toán qua ngân hàng
                        </h1>
                    </div>

                    {/* Bank Selection */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                            Chọn ngân hàng
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            {banks.map((bank) => (
                                <button
                                    key={bank.code}
                                    onClick={() => handleBankSelect(bank.code)}
                                    className={`flex flex-col items-center p-4 border rounded-lg transition-colors ${
                                        selectedBank === bank.code
                                            ? 'bg-blue-500 text-white border-blue-500'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <Image 
                                        src={bank.logo} 
                                        alt={bank.name} 
                                        width={32} 
                                        height={32} 
                                        className="mb-2"
                                    />
                                    <span className="text-sm font-medium text-center">{bank.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
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
                                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xl"
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
                            <div className="grid grid-cols-2 gap-3">
                                {quickAmounts.map((item) => (
                                    <button
                                        key={item.value}
                                        onClick={() => handleQuickSelect(item.value)}
                                        className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                                            amount === item.value
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bank Transfer Info */}
                    {selectedBank && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-medium text-blue-800 mb-2">Thông tin chuyển khoản</h3>
                            <p className="text-sm text-blue-600">
                                Sau khi nhấn "Tiếp tục", bạn sẽ được chuyển đến trang thanh toán của {banks.find(b => b.code === selectedBank)?.name}
                            </p>
                        </div>
                    )}

                    {/* Continue Button */}
                    <button
                        onClick={handleContinue}
                        disabled={!amount || parseInt(amount) <= 0 || !selectedBank}
                        className="w-full bg-blue-500 text-white py-4 px-6 rounded-lg font-medium text-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                    >
                        Tiếp tục
                    </button>
                </div>
            </div>
        </div>
    )
}