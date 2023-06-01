import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserDataService } from 'src/app/shared/services/user-data.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent {

  constructor(private userDataService: UserDataService) {}
  
  @Input() requiredFileType: string;
  @Output() onAvatarChanged = new EventEmitter();

  uploadErrorMessage: string;
  loading: boolean;

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    const formData = new FormData();
    formData.append('file', file)

    this.tryUploadUserAvatar(formData);
  }

  private tryUploadUserAvatar(file: FormData) {
    this.loading = true;

    this.userDataService.uploadUserAvatar(file).subscribe({
      error: (error: Error) => {
        this.uploadErrorMessage = error.message;
        this.loading = false;
      },
      complete: () => { 
        this.onAvatarChanged.emit();
        this.loading = false;
      },
    })
  }
}
