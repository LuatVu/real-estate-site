import Image from 'next/image';
import Form from 'next/form';
import styles from './index.module.css'


export default function SearchingSector({search, openFilterPopup, filterNum}: any) {    

    return (
        <div className='h-full'>
            <Form action={search} className={styles.searchingsession}>
                <div className={styles.searchFieldsParent}>
                    <div className={styles.searchFields}>
                        <div className={styles.frameParent}>
                            <div className={styles.placeHolderWrapper}>
                                <input name="searchKeyword" className={styles.inputText} placeholder="Nhập thông tin bất kỳ ..." />
                            </div>
                            <button type="submit" className={styles.button8}>
                                <Image className={styles.searchIcon} width={24} height={24} alt="" src="/icons/search.svg" />
                            </button>
                        </div>
                    </div>
                    <div className={styles.filterGroup}>
                        <button className={styles.button9} onClick={openFilterPopup}>
                            <Image className={styles.funnelIcon} width={24} height={24} alt="" src="/icons/Funnel.svg" />
                            <div className={styles.filter}>Lọc</div>
                            <div>
                                {filterNum == 0 ? (<p className={styles.filterNumZero + " " + styles.wrapper}>{filterNum}</p>) : (<p className={styles.filterNum + " " + styles.wrapper}>{filterNum}</p>)}
                            </div>
                        </button>
                    </div>
                </div>
            </Form>
        </div>
    );
}