namespace my.library;

using {cuid} from '@sap/cds/common';


entity Books : cuid {
  title    : String;
  stock    : String;
  author   : String;
  ISBN     : String;
  quantity : Integer;
  Aquantity : Integer;
  bookloans : Composition of many bookloans on bookloans.book =$self;
}

entity bookloans : cuid {
  userid     : UUID;
  name        : String;
  username   : String;
  issuedate  : Date;
  returndate : Date;
  book : Association to  one  Books;
  users : Composition of many users on users.bookloan =$self;
}

entity users : cuid {
  name     : String;
  username : String;
  password : String;
  usertype : String;
  bookloan : Association to one bookloans;

}



