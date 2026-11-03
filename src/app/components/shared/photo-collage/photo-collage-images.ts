export interface PhotoCollageImageGroups {
  small: readonly string[];
  medium: readonly string[];
  large: readonly string[];
}

export const MCF_COLLAGE_IMAGES: PhotoCollageImageGroups = {
  small: [
    'assets/images/MCF_Day_1.JPG',
    'assets/images/MCF_Halloween.jpg'
  ],
  medium: [
    'assets/images/MCF_Choir.JPG',
    'assets/images/MCF_Dabke2.JPG',
    'assets/images/MCF_Christmas.jpeg',
    'assets/images/MCF_Crafts.jpeg'
  ],
  large: [
    'assets/images/MCF_Dabke.jpeg',
    'assets/images/MCF_Dabke1.jpeg',
    'assets/images/MCF_Dima.jpeg'
  ],
};

export const MYA_COLLAGE_IMAGES: PhotoCollageImageGroups = {
  small: [
    'assets/images/MYA_Social_Hafli.JPG',
    'assets/images/MYA_Social_Icecream.JPG',
    'assets/images/MYA_Social_OG.JPG',
    'assets/images/MYA_Spiritual_Easter1.JPG',
    'assets/images/MYA_Spritual_Breakfest.JPG',
    'assets/images/MYA_Spritual_Center.JPG'
  ],
  medium: [
    'assets/images/MYA_Social_Putt.jpg',
    'assets/images/MYA_Social_Festival.jpeg',
    'assets/images/MYA_Da_GOAT.jpeg',
    'assets/images/MYA_Service_VolDin.JPG',
  ],
  large: [
    'assets/images/MYA_Saj.jpeg',
    'assets/images/MYA_Service_3_amigos.jpeg',
    'assets/images/MYA_Spiritual_Easter.JPG'
  ]
};

export const MYO_COLLAGE_IMAGES: PhotoCollageImageGroups = {
  small: [
    'assets/images/MYO_1.JPG',
    'assets/images/MYO_2.JPEG',
    'assets/images/MYO_5.JPEG',
    'assets/images/MYO_8.PNG',
    'assets/images/MYO_9.JPEG',
    'assets/images/MYO_12.JPG'
  ],
  medium: [
    'assets/images/MYO_4.JPG',
    'assets/images/MYO_11.JPG',
    'assets/images/MYO_13.JPG',
    'assets/images/MYO_Bowling.JPG'
  ],
  large: [
    'assets/images/MYO_3.JPG',
    'assets/images/MYO_6.JPEG',
    'assets/images/MYO_7.jpg',
    'assets/images/MYO_10.JPG'
  ]
};

export const OLOV_HUB_COLLAGE_IMAGES: PhotoCollageImageGroups = {
  small: [
    ...MCF_COLLAGE_IMAGES.small,
    ...MYA_COLLAGE_IMAGES.small,
    ...MYO_COLLAGE_IMAGES.small
  ],
  medium: [
    ...MCF_COLLAGE_IMAGES.medium,
    ...MYA_COLLAGE_IMAGES.medium,
    ...MYO_COLLAGE_IMAGES.medium
  ],
  large: [
    ...MCF_COLLAGE_IMAGES.large,
    ...MYA_COLLAGE_IMAGES.large,
    ...MYO_COLLAGE_IMAGES.large
  ]
};
