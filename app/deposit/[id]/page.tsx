"use client";
import useScreenSize from '../../lib/useScreenSize';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import styles from './index.module.css'
import NavBarMobile from '../../ui/mobile/navigation/nav-bar-mobile';
import { useParams, useRouter } from 'next/navigation';

export default function DepositPage() {
    const screenSize = useScreenSize();
    const { data: session } = useSession();
    return (
        <div className="flex flex-col min-h-screen">
            {screenSize === 'sm' ? <MobileDeposite session={session} /> : <DesktopDeposite session={session} />}
        </div>
    )
}

function MobileDeposite({ session }: { session?: any }){    
    const params = useParams();
    const router = useRouter();
    const handlePaymentMethod = (method: string) => {
        // Handle payment method selection
        console.log(`Selected payment method: ${method}`);
        // Add your payment logic here
        router.push(`/deposit/${method}/${params.id}`);
    };

    return(
        <div className="flex flex-col min-h-screen">
            <NavBarMobile displayNav={true} session={session} />
            <div className={styles.depositContainer}>
                <h1 className={styles.title}>Nạp tiền vào tài khoản</h1>
                <div className={styles.paymentMethodsContainer}>
                    <div 
                        className={`${styles.paymentMethod} ${styles.bankMethod}`}
                        onClick={() => handlePaymentMethod('bank')}
                    >
                        <Image 
                            src="/icons/bank.svg" 
                            alt="Bank Icon" 
                            width={48}
                            height={48}
                            className={styles.paymentIcon}
                        />
                        <span className={styles.paymentText}>
                            Thanh toán bằng tài khoản ngân hàng
                        </span>
                    </div>
                    
                    <div 
                        className={`${styles.paymentMethod} ${styles.momoMethod}`}
                        onClick={() => handlePaymentMethod('momo')}
                    >
                        <Image 
                            src="/icons/momo.svg" 
                            alt="Momo Icon" 
                            width={48}
                            height={48}
                            className={`${styles.paymentIcon}`}
                        />
                        <span className={styles.paymentText}>
                            Thanh toán bằng ví Momo
                        </span>
                    </div>
                    
                    <div 
                        className={`${styles.paymentMethod} ${styles.visaMethod}`}
                        onClick={() => handlePaymentMethod('visa')}
                    >
                        <Image 
                            src="/icons/visa.svg" 
                            alt="Visa Icon" 
                            width={48}
                            height={48}
                            className={styles.paymentIcon}
                        />
                        <span className={styles.paymentText}>
                            Thanh toán bằng thẻ Visa
                        </span>
                    </div>
                </div>
            </div>
        </div>);
}

function DesktopDeposite({ session }: { session?: any }){
    return <div>Desktop Deposit Page</div>
}