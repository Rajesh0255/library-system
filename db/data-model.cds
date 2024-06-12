namespace my.library;

using {cuid} from '@sap/cds/common';


entity Books : cuid {
  title    : String;
  stock    : String;
  author   : String;
  ISBN     : String;
  quantity : Integer;
  Aquantity : Integer;
  bookloans : Composition of many Bookloans on bookloans.book =$self;
  NotifyB : Composition of many Notify on NotifyB.BookDetails =$self;
}

entity Bookloans : cuid {
  issuedate  : Date;
  returndate : Date;
  book : Association to  one  Books;
  user : Association to   one users;
 
}

entity users : cuid {
  name     : String;
  username : String;
  password : String;
  usertype : String;
  
  bookloan : Association to many Bookloans on bookloan.user =$self;
  issueBooks  : Association to many IssueBooks
                  on issueBooks.user1 = $self;
  NotifyU: Association to many Notify on NotifyU.UserDetails = $self;
}

entity IssueBooks : cuid {
  book1         : Association to Books;
  user1         : Association to users;
  reservedDate : Date
}


entity Notify : cuid {
  Notifytype : String;
  time:String;
  date:String;
  priority:String;
  BookDetails: Association to Books;
  UserDetails : Association to users;
  
}


