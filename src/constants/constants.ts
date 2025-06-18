import { AddressError, ILocales, TeamMember } from '~types/types';
import Tanya from '~/assets/images/tanya.jpg';
import Nastassya from '~/assets/images/nastassya.jpg';
import Kirill from '~/assets/images/kirill.jpg';

export const PROJECT_KEY = 'rssecomm';
const CLIENT_ID = 'VSoSJL93ehdNSp2ILY62b3zG';
const CLIENT_SECRET = '9xPxdvPzFxRVhOAw4_U1Qkbcub8EcT1U';
export const BASIC_AUTH_HEADER =
  'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

const GUEST_PERMISSIONS = {
  VIEW_PRODUCTS: 'view_products',
  VIEW_CATEGORIES: 'view_categories',
  MANAGE_MY_ORDERS: 'manage_my_orders',
  CREATE_ANONYMOUS_TOKEN: 'create_anonymous_token',
} as const;

const USER_PERMISSIONS = {
  ...GUEST_PERMISSIONS,
  MANAGE_MY_ORDERS: 'manage_my_orders',
  MANAGE_MY_PROFILE: 'manage_my_profile',
} as const;

const API_PERMISSIONS = {
  CREATE_ANONYMOUS_TOKEN: 'create_anonymous_token',
} as const;

const ALL_PERMISSIONS = {
  ...GUEST_PERMISSIONS,
  ...USER_PERMISSIONS,
  ...API_PERMISSIONS,
} as const;

export const permissions = {
  api: API_PERMISSIONS,
  user: USER_PERMISSIONS,
  guest: GUEST_PERMISSIONS,
  all: ALL_PERMISSIONS,
} as const;

export const BASE_API_URL = 'https://api.eu-central-1.aws.commercetools.com/';
export const BASE_AUTH_URL = 'https://auth.eu-central-1.aws.commercetools.com/';
export const USER_AUTH_TOKEN = `oauth/${PROJECT_KEY}/customers/token`;
export const GUEST_AUTH_TOKEN_URL = `${BASE_AUTH_URL}oauth/${PROJECT_KEY}/anonymous/token`;
export const USER_AUTH_URL = `${BASE_AUTH_URL}${USER_AUTH_TOKEN}`;
export const PUBLISHED_PRODUCTS_URL = `${BASE_API_URL}${PROJECT_KEY}/product-projections`;
export const CUSTOMER_CREATION_URL = `${BASE_API_URL}${PROJECT_KEY}/customers`;
export const CATEGORIES_URL = `${BASE_API_URL}${PROJECT_KEY}/categories`;

export const locales: ILocales = {
  DE: 'de-DE',
  EN: 'en-US',
  UK: 'en-GB',
} as const;

export const defaultAddressInfo = {
  id: '',
  streetName: '',
  city: '',
  postalCode: '',
  country: '',
};

export const defaultUserInfo = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  dateOfBirth: '',
};

export const initialAddressState: AddressError = {
  streetName: '',
  city: '',
  postalCode: '',
  country: '',
};

export const initialProfileState = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  email: '',
};

export const defaultAddressIndex = -1;
export const PRODUCTS_PER_PAGE = 6;
export const MY_CARTS_URL = `${BASE_API_URL}${PROJECT_KEY}/me/carts`;
export const MY_ACTIVE_CART_URL = `${BASE_API_URL}${PROJECT_KEY}/me/active-cart`;
export const promoCodes = ['SAVE10', 'WELCOME5'];
export const PROMO_DISCOUNTS_RATE: Record<string, number> = {
  SAVE10: 0.1,
  WELCOME5: 0.05,
};

export const teamMembers: TeamMember[] = [
  {
    img: Tanya,
    name: 'Tatsiana Kuryla',
    role: 'Team Lead',
    desc: 'Supervised the completion of tasks at hand. Developed more than half of the application.',
    bio: `I was born in Grodno, Belarus. After finishing school, I moved to Minsk to study at the Belarusian State Economic University in the faculty of Marketing and Logistics. My specialty is Logistics.

Professional Background
My professional career began during the fourth year of study at the university in the procurement sphere. Over the period of five years, I worked my way up from Purchasing Specialist to Category Manager, gaining experience in both small companies and the largest retail chain in Belarus, which operates over 1,000 stores nationwide.

My interest in the IT sphere started unexpectedly—during a casual gathering with my developer friends. They were discussing work-related topics, and to my surprise (and to their surprise), I was able to follow the conversation intuitively. They encouraged me to try programming, convinced that I had the right mindset for it. This is how I first started thinking about IT courses. I started with three-month courses in HTML and CSS in 2022, and eventually decided to focus on Frontend Development.

However, juggling between full-time work and studying was a difficult task for me. The turning point came when I decided to move to another country in 2023. Since my company didn’t support remote work, I resigned. This gave me the perfect opportunity to fully dedicate myself to programming. Now, I am deeply engaged in learning Frontend technologies. I have completed courses in:
- HTML  
- CSS  
- JavaScript  
- TypeScript  

And I am currently studying ReactJS. The more I learn, the more passionate I become. I love the logical challenges that frontend development offers, and I feel really happy when I see the result of my work, when my project works well.`,
    github: 'https://github.com/tatsianakuryla',
  },
  {
    img: Nastassya,
    name: 'Anastasiya Voroshkevich',
    role: 'Software Developer',
    desc: 'Project setup. Mobile version.',
    bio: `I am from Belarus. I finished the physics and mathematics department of Brest State University named after A.S. Pushkin and am currently attending the RSSchool interactive course. I worked in a hospital as a programmer—editing information on the hospital website, interacting with users, and maintaining basic applications. I also served as the site administrator.

In my free time, I strive to upgrade my skills and knowledge in front-end development. It is very difficult for me to combine work and study, but I believe that through hard work I will become an experienced front-end developer. I have completed a course on HTML & CSS layout of sites on Web-cademy.ru (technologies: HTML, CSS, responsive layout, PixelPerfect, JS basics) and the “Development of Web Applications in JavaScript” course at IT-Academy (technologies: ES2015, SPA architecture, localStorage state, fetch requests).

My graduation project was a test simulator written specifically for students and teachers who love math. The simulator is a collection of math tests—after passing, students see their gaps in knowledge and teachers help fill them.`,
    github: 'https://github.com/nastasiya-voroshkevich',
  },
  {
    img: Kirill,
    name: 'Kiryl Makhvienia',
    role: 'Software Developer',
    desc: 'Project setup. Integrate auth service, handle errors. Registration API integration. Display products on the main page.',
    bio: `Originally from Belarus, and having finished courses there, Kiryl Makhvienia now lives in Lithuania, where he works as a software tester. He's currently studying Python, as it's required for his main job. With a sharp eye for detail and a love for figuring out how things work, Kiryl has always been drawn to the inner mechanics of digital products.

“I enjoy testing because it’s like solving a puzzle,” he says. “You need to think critically, spot things others might miss, and make sure everything runs smoothly.” 

“What I love about frontend is the instant feedback. You write code—and you see the result right away. It’s creative and logical at the same time,” he explains. “It’s exciting to bring designs to life and make products feel intuitive for users.”`,
    github: 'https://github.com/mahveenya',
  },
];
