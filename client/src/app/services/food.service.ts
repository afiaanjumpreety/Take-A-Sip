import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FOODS } from '../interfaces/food-types';
import { Food } from '../interfaces/food';
import { SelectedFoodAttribute } from '../interfaces/selectedFoodAttribute';
import { OrderList } from '../interfaces/orderlist';

import { HttpClient } from '@angular/common/http'
import { User } from '../interfaces/user';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FoodService {

  url = `${environment.apiUrl}/orders`;
  
  listItems: Food[] = [];
  selectedAttribute:  SelectedFoodAttribute[] = [];

  constructor(private http: HttpClient) { }

  /*Data passing with Api*/
  getAllOrders(): Observable<OrderList[]> {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: {
        'Authorization': token ? token : ''
      }
    }

    return this.http.get<OrderList[]>(this.url, httpOptions);
  }
  
  addOrder (user: User, foods: Food[], status: string, orderfor: string, room: string) : Observable<OrderList> {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return this.http.post<OrderList>(this.url,{ user, foods, status, orderfor,room}, httpOptions);
  }


  updateStatus (id: string, status: string) : Observable<OrderList> {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? token : ''
      }
    };

    return this.http.put<OrderList>(this.url + `/${id}/${status}`, {}, httpOptions);
  }

  deleteOrder(id: string) : Observable<OrderList> {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? token : ''
      }
    };
    return this.http.delete<OrderList>(this.url + `/${id}`,httpOptions);
  }
  
  /*Food Section*/
  getFoods(): Food[] {
    return FOODS;
  }

   getFood(id: number): Observable<Food | undefined> {
    const food = FOODS.find(food => food.id === id);
    return of(food);    
  }

 
  /*List Part*/
  findItemById(listItems: any, id: number,selectedFlavor: string) {
    return listItems.find(function(item: { id: number,selectedFlavor: string }) {
      return item.id === id && item.selectedFlavor === selectedFlavor;
    });
  };

  addToList(food: Food, selectedAttribute: SelectedFoodAttribute) {
  let foodRef: Food = {
    id: 0,
    name: '',
    imageUrls: [],
    flavors: [],
    selectedFlavor: '',
    qty: 0,
    note: 'e.g. sugar 2 teaspoon(tsp.) ...'
  };
    Object.assign(foodRef,food);
    foodRef.selectedFlavor = selectedAttribute.flavor?.name
    this.listItems.push(foodRef);
    // localStorage.setItem('list', JSON.stringify(this.listItems));
    // localStorage.setItem('selectedItems', JSON.stringify(this.selectedAttribute));
  }

  getListItems() {
    // if(localStorage.getItem('list')){
    //   this.listItems = JSON.parse(localStorage.getItem('list') || '[]');
    // }
    return this.listItems;
  }
  
  getSelectedItems() {
    // if(localStorage.getItem('selectedItems')){
    //   this.selectedAttribute = JSON.parse(localStorage.getItem('selectedItems') || '[]');
    // }
    return this.selectedAttribute;
  }

  removeSelectedItems() {
    localStorage.setItem('list', JSON.stringify(this.listItems));
  }

  updateSelectedItems() {
    localStorage.setItem('list', JSON.stringify(this.listItems));
  }

  clearList() {
    this.listItems.length = 0;
    // localStorage.removeItem('list');
    // localStorage.removeItem('selectedItems');
    return this.listItems;
  }
  


}
