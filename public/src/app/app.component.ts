import { HttpClient } from '@angular/common/http';

import { Component,HostListener,OnInit, Inject } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  elements = [1];
  count = 1;
  totalLength:any;
  isEnd:boolean = false;
  isLoading :boolean=true;
  sortedValue:any="id";
  public asciiData:any=[]
  constructor(private Http:HttpClient ){
   
  }
  ngOnInit(){
     this.getallarayData().then((e)=>{
      this.getPaginate();
    })
  }

  
  getPaginate(){
    this.Http.get(`http://localhost:3000/api/products?_page=1&_limit=15&_sort=${this.sortedValue}`).subscribe((result:any)=>{
      let resultValue;
      resultValue= result.map((e:any)=>{
               e["centsIntodoler"]=(e.price*0.01);
               e["relativeDate"] = this.dateIntoRelativeDate(e.date)
               return e;
           })
      this.asciiData = resultValue;
     
})
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
     let array2:any =[];
    if (this.bottomReached()) {
      this.showLoader()
      setTimeout(async () => {
        try {
          this.count=this.count+1;
          this.Http.get(`http://localhost:3000/api/products?_page=${this.count+1}&_limit=15&_sort=${this.sortedValue}`).subscribe((result:any)=>{
               let resultValue;
               resultValue= result.map((e:any)=>{
                        e["centsIntodoler"]=e.price*0.01
                        e["relativeDate"] = this.dateIntoRelativeDate(e.date)
                        return e;
                    })
                 array2 = resultValue;
                this.asciiData = this.asciiData.concat(array2);
                if(array2.length==0){
                  this.showEndMsg()
                }
            })
        } catch (error) {
           
        } finally {
            this.hideLoader();
          
        }
    }, 2000);
  
  }
}


  bottomReached(): boolean {
    return (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
  }

 showLoader(){
    this.isLoading = true;
  }

  hideLoader(){
    this.isLoading = false;
  }

  getallarayData(){
    return new Promise((resolve, reject) =>{this.Http.get("http://localhost:3000/api/products").subscribe((result:any)=>{
     this.totalLength= result.length;

          resolve(result)
    })
  })
  }

  showEndMsg(){
      this.isEnd=true
    
  }



dateIntoRelativeDate(dateNew:any){
  const date:any = new Date(dateNew);
  const  todayDate:any = new Date()
  const dateString =
    date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
  const seconds = Math.floor(( todayDate - date) / 1000);
 let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return dateString;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return dateString;
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    if (interval > 7) {
      return dateString;
    }
    return interval + " days ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval + " hours ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
};



selectedValue(data:any){
  this.sortedValue= data.target.value;
 this.getPaginate();
}
} 
