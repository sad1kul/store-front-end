// DEPRECATED: kept temporarily for fallback during API migration.
import productsData from "./products.json";
import usersData from "./users.json";
import ordersData from "./orders.json";
import bulkAppsData from "./bulk-applications.json";
import { Product, UserAccount, Order, WholesaleApplication } from "@/lib/types";

export const allProducts = productsData as unknown as Product[];
export const allUsers = usersData as unknown as UserAccount[];
export const allOrders = ordersData as unknown as Order[];
export const allApps = bulkAppsData as unknown as WholesaleApplication[];
