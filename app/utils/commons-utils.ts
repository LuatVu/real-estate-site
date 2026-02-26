export const formatLegalStatus = (legal: string) => {
    if (!legal) return '';
    
    const legalMap: { [key: string]: string } = {
      'SO_DO': 'Sổ đỏ',
      'HOP_DONG_MUA_BAN': 'Hợp đồng mua bán',
      'KHONG_SO': 'Không sổ'
    };
    
    return legalMap[legal] || legal;
};

export const formatFurnitureStatus = (furniture: string) => {
    if (!furniture) return '';
    
    const furnitureMap: { [key: string]: string } = {
      'DAY_DU': 'Đầy đủ',
      'CO_BAN': 'Cơ bản',
      'KHONG_NOI_THAT': 'Không nội thất'
    };
    return furnitureMap[furniture] || furniture;
};

export const formatDirection = (direction: string) => {
    if (!direction) return '';
    const directionMap: { [key: string]: string } = {
      'BAC': 'Bắc',
      'NAM': 'Nam',
      'DONG': 'Đông',
      'TAY': 'Tây',
      'DONG_BAC': 'Đông Bắc',
      'TAY_BAC': 'Tây Bắc',
      'DONG_NAM': 'Đông Nam',
      'TAY_NAM': 'Tây Nam'
    };
    return directionMap[direction] || direction;
}

