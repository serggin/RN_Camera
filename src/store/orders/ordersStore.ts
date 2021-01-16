import {OrdersActionType} from "./ordersReducer";
import {IDataItem} from "api_orders_v1.0_order_{ownerid}_GET_Rs";


export interface OrdersState {
    actual: boolean;
    orders: IOrder[];
}

export interface IOrder extends IDataItem{
    buyerName: string;
    price: string;
}

export const defaultState:OrdersState = {
    actual: false,
    orders: [],
}

export interface OrdersStore {
    state: OrdersState;
    dispatch?: React.Dispatch<{ type: OrdersActionType; payload?: any }>;

}
