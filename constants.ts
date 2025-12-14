
import { ProjectData } from './types';

// Raw data parsed from the CSV provided
export const PROJECTS: ProjectData[] = [
  { id: 1, project_name: "The Sun Avenue - 1 bedrooms", cost: 4676470600, pv_rent_cf: 557541403, pv_sale: 7893736112, npv: 3774806914, rental_fee_monthly: 10000000, address: "28 Mai Chí Thọ, Phường An Khánh", distance_km: 8.5 },
  { id: 2, project_name: "The Sun Avenue - 2 bedrooms", cost: 6723684199, pv_rent_cf: 919943314, pv_sale: 10390505177, npv: 4586764292, rental_fee_monthly: 16500000, address: "28 Mai Chí Thọ, Phường An Khánh", distance_km: 8.5 },
  { id: 3, project_name: "Masteri Lumiere Thảo Điền - 1 bedrooms", cost: 6664000000, pv_rent_cf: 1282345226, pv_sale: 10515850509, npv: 5134195735, rental_fee_monthly: 23000000, address: "628A Võ Nguyên Giáp, Phường An Phú", distance_km: 7.8 },
  { id: 4, project_name: "Masteri Lumiere Thảo Điền - 2 bedrooms", cost: 7777777770, pv_rent_cf: 1951394909, pv_sale: 11450501879, npv: 5624119019, rental_fee_monthly: 35000000, address: "628A Võ Nguyên Giáp, Phường An Phú", distance_km: 7.8 },
  { id: 5, project_name: "Thảo Điền Green - 1 bedrooms", cost: 9000000020, pv_rent_cf: 1672624208, pv_sale: 14031791111, npv: 6704415299, rental_fee_monthly: 30000000, address: "192 Nguyễn Văn Hưởng, Phường An Khánh", distance_km: 8.7 },
  { id: 6, project_name: "Thảo Điền Green - 2 bedrooms", cost: 15809523770, pv_rent_cf: 2676198733, pv_sale: 31915913924, npv: 18782588887, rental_fee_monthly: 48000000, address: "192 Nguyễn Văn Hưởng, Phường An Khánh", distance_km: 8.7 },
  { id: 7, project_name: "Centana - 1 bedrooms", cost: 3150000000, pv_rent_cf: 529664333, pv_sale: 4559550955, npv: 1939215287, rental_fee_monthly: 9500000, address: "36 Mai Chí Thọ, Phường An Phú", distance_km: 8.4 },
  { id: 8, project_name: "Centana - 2 bedrooms", cost: 4721311488, pv_rent_cf: 669049683, pv_sale: 6900968825, npv: 2848707021, rental_fee_monthly: 12000000, address: "36 Mai Chí Thọ, Phường An Phú", distance_km: 8.4 },
  { id: 9, project_name: "Precia - 1 bedrooms", cost: 4399999982, pv_rent_cf: 641172613, pv_sale: 6750227730, npv: 2991400361, rental_fee_monthly: 11500000, address: "21 Nguyễn Thị Định, Phường An Phú", distance_km: 8.4 },
  { id: 10, project_name: "Precia - 2 bedrooms", cost: 5599999969, pv_rent_cf: 836312104, pv_sale: 9671225895, npv: 4907538030, rental_fee_monthly: 15000000, address: "21 Nguyễn Thị Định, Phường An Phú", distance_km: 8.4 },
  { id: 11, project_name: "Him Lam Phú An - 2 bedrooms", cost: 3801900000, pv_rent_cf: 501787262, pv_sale: 5880602234, npv: 2580489496, rental_fee_monthly: 9000000, address: "32 Thủy Lợi, Phước Long A", distance_km: 12 },
  { id: 12, project_name: "The Art (Gia Hoà) - 2 bedrooms", cost: 4008900000, pv_rent_cf: 524088919, pv_sale: 6549340024, npv: 3064528942, rental_fee_monthly: 9400000, address: "523A Đ. Đỗ Xuân Hợp, Phước Long B, Thủ Đức", distance_km: 14 },
  { id: 13, project_name: "Jamila Khang Điền - 2 bedrooms", cost: 4522000000, pv_rent_cf: 652323441, pv_sale: 8385492237, npv: 4515815678, rental_fee_monthly: 11700000, address: "Song Hành, Phường Phú Hữu, Thủ Đức", distance_km: 12 },
  { id: 14, project_name: "Jamila Khang Điền - 3 bedrooms", cost: 6395400000, pv_rent_cf: 752680894, pv_sale: 11859481878, npv: 6216762771, rental_fee_monthly: 13500000, address: "Song Hành, Phường Phú Hữu, Thủ Đức", distance_km: 12 },
  { id: 15, project_name: "9View Apartment - 2 bedrooms", cost: 2499800000, pv_rent_cf: 501787262, pv_sale: 2820189326, npv: 822176588, rental_fee_monthly: 9000000, address: "1 Đ. Số 1, Phước Long B, Thủ Đức", distance_km: 13 },
  { id: 16, project_name: "9View Apartment - 3 bedrooms", cost: 3749700000, pv_rent_cf: 613295543, pv_sale: 4230283989, npv: 1093879532, rental_fee_monthly: 11000000, address: "1 Đ. Số 1, Phước Long B, Thủ Đức", distance_km: 13 },
  { id: 17, project_name: "Centum Wealth Complex - 2 bedrooms", cost: 3263400000, pv_rent_cf: 501787262, pv_sale: 4757384685, npv: 1995771948, rental_fee_monthly: 9000000, address: "2A Phan Chu Trinh, Hiệp Phú, Thủ Đức", distance_km: 14 },
  { id: 18, project_name: "Centum Wealth Complex - 3 bedrooms", cost: 4144000000, pv_rent_cf: 613295543, pv_sale: 6041123410, npv: 2510418953, rental_fee_monthly: 11000000, address: "2A Phan Chu Trinh, Hiệp Phú, Thủ Đức", distance_km: 14 },
  { id: 19, project_name: "Lavita Charm - 1 bedrooms", cost: 2888834310, pv_rent_cf: 487848727, pv_sale: 4007626075, npv: 1606640492, rental_fee_monthly: 8750000, address: "58 Đường Số 1, Trường Thọ, Thủ Đức", distance_km: 13 },
  { id: 20, project_name: "Lavita Charm - 2 bedrooms", cost: 3345552770, pv_rent_cf: 641172613, pv_sale: 3530369327, npv: 825989170, rental_fee_monthly: 11500000, address: "58 Đường Số 1, Trường Thọ, Thủ Đức", distance_km: 13 },
  { id: 21, project_name: "Moonlight Residences - 1 bedrooms", cost: 3332673234, pv_rent_cf: 538956652, pv_sale: 4211050500, npv: 1417333918, rental_fee_monthly: 9666666, address: "102 đường Đặng Văn Bi, phường Bình Thọ, thành phố Thủ Đức", distance_km: 14 },
  { id: 22, project_name: "Moonlight Residences - 2 bedrooms", cost: 3169902887, pv_rent_cf: 627234078, pv_sale: 2579152064, npv: 36483255, rental_fee_monthly: 11250000, address: "102 đường Đặng Văn Bi, phường Bình Thọ, thành phố Thủ Đức", distance_km: 14 },
  { id: 23, project_name: "Lotus Sen Hồng  - 1 bedrooms", cost: 1325136000, pv_rent_cf: 250893631, pv_sale: 1242458602, npv: 168216233, rental_fee_monthly: 4500000, address: "Xa Lộ Đại Hàn, Phường Tam Bình, Thủ Đức", distance_km: 20.2 },
  { id: 24, project_name: "Lotus Sen Hồng  - 2 bedrooms", cost: 1849095216, pv_rent_cf: 362401912, pv_sale: 2041592117, npv: 554898813, rental_fee_monthly: 6500000, address: "Xa Lộ Đại Hàn, Phường Tam Bình, Thủ Đức", distance_km: 20.2 },
  { id: 25, project_name: "Sunview town - 2 bedrooms", cost: 2380182813, pv_rent_cf: 441572791, pv_sale: 2186968957, npv: 248358935, rental_fee_monthly: 7920000, address: "Hiệp Bình Phước, Thủ Đức", distance_km: 14.4 },
  { id: 26, project_name: "Flora Novia - 2 bedrooms", cost: 3209183636, pv_rent_cf: 376340447, pv_sale: 4437268201, npv: 1604425012, rental_fee_monthly: 6750000, address: "1061 Đ. Phạm Văn Đồng, Linh Tây, Thủ Đức", distance_km: 17.3 },
];

export const CONSTANTS = {
  DISCOUNT_RATE: 0.047, // From R script
  MAX_UNITS_PER_PROJECT: 3, // From R script: Constraint_Max_Units_Per_Project
};
