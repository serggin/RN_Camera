import {OrdersState} from "./ordersStore";

export enum OrdersActionType {
    SET_ORDERS = 'SET_ORDERS',
}

export type Action = { type: OrdersActionType; payload?: any };

export const ordersReducer = (prevState: OrdersState, action: Action) => {
    console.log('ordersReducer', action);
    switch (action.type) {
        case OrdersActionType.SET_ORDERS:
            return {
                ...prevState,
                actual: true,
                orders: action.payload.orders,
            }
        default:
            return prevState;
    }
}
