import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  constructor(private spotify: SpotifyService) { }
  categoryList: any[];
  ngOnInit() {
    //this.spot.listCategories().pipe(take(1)).subscribe(cats => {
    //console.log(cats.categories);
    //  this.categoryList = new GetRandom().randomPicks(4,cats.categories.items);
    //console.log(this.categoryList);
    //})
  }

}
