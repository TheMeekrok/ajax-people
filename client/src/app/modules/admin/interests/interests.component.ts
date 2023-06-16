import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AdminService } from "../../../shared/services/admin.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserDataService } from "../../../shared/services/user-data.service";
import { IInterest } from "../../../shared/models/Interest";


interface Data {
  id: number
  title: string
  isDeleted: boolean
}

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.css']
})
export class InterestsComponent implements OnInit {
  isLoading: boolean;
  @ViewChild('childContainer', { read: ViewContainerRef }) childContainer: ViewContainerRef;

  interests: IInterest[];
  form: FormGroup;

  displayedColumns: string[] = ["id", "title", "delete"];
  dataSource: MatTableDataSource<Data>;

  constructor(private adminService: AdminService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private userDataService: UserDataService
  ) {
    this.isLoading = true;
    this.uploadInterests();
  }
  ngOnInit() {
    this.form = new FormGroup({
      newTag: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ])
    });
  }

  /**
   * ОБновляет тэги при удалении / добавлении
   */
  uploadInterests() {
    this.isLoading = true;
    this.userDataService.getInterests().subscribe( {
        next: (data) => {
          this.interests = data;
          const dataSource: Data[] = [];
          for (const t of this.interests) {
            dataSource.push({
              id: t.id,
              title: t.title,
              isDeleted: false,
            })
          }
          this.dataSource  = new MatTableDataSource(dataSource)
        },
        error: (error: Error) => {
          console.log(error);
        },
        complete: () => this.isLoading = false
      }
    )
  }
  get getInterestErrorMessage(): string {
    const errors = this.form.controls['newTag']?.errors;
    if (errors?.['required']) {
      return "Введите новый интерес";
    }
    if (errors?.['minlength']) {
      return "Минимум 3 символа";
    }
    if (errors?.['maxlength']) {
      return "Максимум 20 символов";
    }
    return "";
  }

  showMessage(message: string) {
    this.snackBar.open(message, "Ок");
  }

  onCreateInterestClick() {
    if (this.form.invalid) {
      return;
    }
    const newTag = this.form.controls['newTag'].value;
    this.adminService.createInterest({title: newTag}).subscribe();
    this.showMessage("Интерес успешно добавлен");
    this.form.reset();
    this.uploadInterests();

  }


  onDeleteInterestClick($event: Event, data: Data) {
    if (data.isDeleted) {
      return;
    }
    this.adminService.deleteInterest(data.id).subscribe( {
        next: () => console.log("success"),
        error: (error: Error) => console.log(error),
      }
    )
    data.isDeleted = true;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
