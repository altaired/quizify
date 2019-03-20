import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';
import { CategoryObj } from 'src/app/models/spotify';
import { take } from 'rxjs/operators';
import { GetRandom } from 'src/app/utils/get-random';

@Component({
  selector: 'app-category-pick',
  templateUrl: './category-pick.component.html',
  styleUrls: ['./category-pick.component.scss']
})
export class CategoryPickComponent implements OnInit {

  constructor(private spot: SpotifyService) { }
  categoryList :any[];
  ngOnInit() {
    //this.spot.listCategories().pipe(take(1)).subscribe(cats => {
    //console.log(cats.categories);
    //  this.categoryList = new GetRandom().randomPicks(4,cats.categories.items);
    //console.log(this.categoryList);
    //})
  }

}
