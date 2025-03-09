import { Component } from "@angular/core";
import { virtualRouter } from "./../../services/virtualRouter.service"; // Asegúrate de que la ruta sea correcta
import { GlobalService } from "./../../services/global.service"; // Asegúrate de que la ruta sea correcta
import { ScriptService } from "./../../services/script.service";
import { HttpClient } from "@angular/common/http";
import { UploaderCaptions } from "ngx-awesome-uploader";
import { CustomFilePickerAdapter } from "../file-picker.adapter";
import { DataApiService } from "./../../services/data-api-service";
import { Butler } from "./../../services/butler.service";
import { Yeoman } from "./../../services/yeoman.service";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { AddbrandComponent } from "../addbrand/addbrand.component";
import { AddcategoryComponent } from "../addcategory/addcategory.component";
import { ModalComponent } from "@app/components/modal/modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { NgxImageCompressService } from "ngx-image-compress";
import { ImageUploadService } from '@app/services/image-upload.service';

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrl: "./products.component.css",
  // providers: [NgbActiveModal]
})
export class ProductsComponent {
  dropdownList = [];
  imgResultsAfterCompression = [];
  imgResultsBeforeCompression = [];
  selectedItems = [];
  showColors: boolean = true; // Agrega la propiedad 'showColors' al componente y dale un valor inicial de false
  // Dentro de tu componente Angular

  showDeleteButton: boolean = false;

  // dropdownSettings = {};
  dropdownSettings: IDropdownSettings = {};
  editing = false;
  adding = false;
  category = "Seleccione una";
  categorySeted: boolean = false;
  isEditing = false;
  clients$: any = {};
  public captions: UploaderCaptions = {
    dropzone: {
      title: "Imágenes del producto",
      or: ".",
      browse: "Cargar",
    },
    cropper: {
      crop: "Cortar",
      cancel: "Cancelar",
    },
    previewCard: {
      remove: "Borrar",
      uploadError: "error",
    },
  };
  data = {
    id: "",
   /*  brand: [] as any[],
    formats: [] as any[],
    dimensions: [] as any[],
    category: "",
    categories: [] as any[],
    colors: [] as any[],
     type: [] as any[],
    description: "",
    collection: "",
    price: 0,
    weight: 0,
    technique: "",
    material: "",
    status:"",
    yearCreation: "",
    stockLevel: 0,
    stockMin: 0, */
    files: [] as string[],
    name: "",
    
  };

  // adapter = new CustomFilePickerAdapter(this.http, this._butler);
  adapter = new CustomFilePickerAdapter(this.http, this._butler, this.global);
  imgResult: string = '';
  imgResultAfterCompression: string = '';
  imgResultBeforeCompression: string = '';
  constructor(
    private imageUploadService: ImageUploadService,
    private modalService: NgbModal,
    public imageCompress: NgxImageCompressService,
    public script: ScriptService,
    public virtualRouter: virtualRouter,
    public global: GlobalService,
    public http: HttpClient,
    public _butler: Butler,
    public yeoman: Yeoman,
    public dataApiService: DataApiService
  ) {


    this.getAllCategories();
    this.getAllBrands();
    this.getAllVideos();
    this.dropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "name",
      selectAllText: "Seleccionar todo",
      unSelectAllText: "Deseleccionar todo",
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }
  //   compressFile() {
  //     this.imageCompress.uploadFile().then(({image, orientation}) => {
  //         this.imgResultBeforeCompression = image;
  //         console.log('Size in bytes of the uploaded image was:', this.imageCompress.byteCount(image));

  //         this.imageCompress
  //             .compressFile(image, orientation, 50, 50) // 50% ratio, 50% quality
  //             .then(compressedImage => {
  //                 this.imgResultAfterCompression = compressedImage;
  //                 console.log('Size in bytes after compression is now:', this.imageCompress.byteCount(compressedImage));
  //             });
  //     });
  // }


  /* toggleColor(color: any) {
    const index = this.data.colors.findIndex((c) => c.hex === color.hex);
    if (index === -1) {
      // Si el color no está en la lista, lo agregamos
      this.data.colors.push(color);
    } else {
      // Si el color está en la lista, lo eliminamos
      this.data.colors.splice(index, 1);
    }
  }
  isChecked(): boolean {
    if (this.data.colors.length > 0 && this.global.editingProduct) {
      this.showColors = !this.showColors;
      return this.data.colors.length > 0;
    } else {
      // this.showColors = false;
      return false;
    }
  }

  isColorSelected(color: any): boolean {
    return this.data.colors.some((c) => c.hex === color.hex);
  } */

  add() {
    this.global.productSelected = {
      id:"",
      files: [] as string[],
      name: "",
    };
    this.data = {
      id:"",
      files: [] as string[],
    name: "",
    };

    this.global.editingProduct = false;
    this.global.addingProduct = true;
  }
  edit(client: any) {
    this.data = this.global.productSelected;
    this.global.editingProduct = true;
    this.global.addingProduct = false;
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent);
    // Puedes pasar datos al modal utilizando el método 'componentInstance' del modalRef.
    // modalRef.componentInstance.data = myData;
  }
  openAddbrand() {
    const modalRef = this.modalService.open(AddbrandComponent);

    // Puedes pasar datos al modal utilizando el método 'componentInstance' del modalRef.
    // modalRef.componentInstance.data = myData;
  }
  openAddcategory() {
    const modalRef = this.modalService.open(AddcategoryComponent);

    // Puedes pasar datos al modal utilizando el método 'componentInstance' del modalRef.
    // modalRef.componentInstance.data = myData;
  }

  cancelarUpdate() {
    this.global.editingProduct = false;
    this.global.addingProduct = false;
    this.data = {
      id:"",
      files: [] as string[],
    name: "",

    };

    this.global.productSelected = {
      id:"",
      files: [] as string[],
    name: "",
    };
  }
  preview(client: any) {
    this.global.productSelected = client;
    this.global.productPreview = true;
  }
  beforeDelete() {
    Swal.fire({
      cancelButtonText: "No, mejor no",
      confirmButtonText: "Sí, bórralo!",
      icon: "warning",
      showCancelButton: true,
      text: "esta acción no se podrá revertir!",
      title: "Seguro deseas borrar este producto?",
    }).then((result) => {
      if (result.value) {
        this.deleteProduct();
        Swal.fire("Borrada!", "success");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelado", "", "error");
      }
    });
  }

  updateProduct() {
    this.data.files =
      this._butler.uploaderImages.length > 0
        ? this._butler.uploaderImages
        : this.global.productSelected.files;

    this.dataApiService
      .productUpdate(this.data, this.global.productSelected.id)
      .subscribe((response) => {
        console.log(response);
        this.global.loadProducts();
        this.global.editingProduct = false;
        this.virtualRouter.routerActive = "products";
        this.data = {
          id:"",
          files: [] as string[],
          name: "",
        };

        this._butler.uploaderImages = [];
        (this.global.addingProduct = false),
          (this.global.editingProduct = false),
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Actualizado",
            showConfirmButton: false,
            timer: 1500,
          });
      });
  }
  deleteProduct() {
    this.global
      .deleteProduct(this.global.productSelected.id)
      .subscribe((response) => {
        this.global.productSelected = {
          name: "Seleccionar",
          files: [],
          id: "",
        };
        this.global.loadProducts();

        this.global.productSelected = {
          id:"",
          files: [] as string[],
          name: ""
        };
      });
  }
  onSubmit() {
    // this.data.ref = (Math.floor(Math.random() * 10000000000000)).toString();
    this.data.files = this._butler.uploaderImages;
    this.dataApiService.saveClient(this.data).subscribe((response) => {
      console.log(response);
      this.global.loadProducts();
      this._butler.uploaderImages = [];
      this.data = {
        id:"",
        files: [] as string[],
        name: "",
      };

      this.global.editingProduct = false;
      Swal.fire("Bien...", "Video agregado satisfactoriamente!", "success");
      this.global.editingProduct = false;
      this.global.addingProduct = false;
      this.global.loadProducts();
      this.virtualRouter.routerActive = "products";
    });
    console.log(this.data);
  }
  getAllCategories() {
    this.dataApiService.getAllCategory().subscribe((response) => {
      this.yeoman.categories = response;
      this.yeoman.allcategory = response;
      this.yeoman.categories = this.yeoman.categories.items;
      this.yeoman.allcategory = this.yeoman.allcategory.items;
      this.yeoman.allCategoriesSize = this.yeoman.categories.length;
    });
  }
  getAllBrands() {
    this.dataApiService.getAllBrand().subscribe((response) => {
      this.yeoman.brands = response;
      // this.yeoman.allcategory = response;
      this.yeoman.brands = this.yeoman.brands.items;
    });
  }

  getAllVideos() {
    this.dataApiService.getAllProducts().subscribe((response) => {
      this.yeoman.products = response;
      this.yeoman.products = this.yeoman.products.items;
    });
  }
  onCategorySelect(category: any) {
    // this.data.category = "c" + category.id;
    console.log(category.id);
  }

  // setCategory(category: any) {
  //   let index = category;
  //   console.log("seleccionada: " + this.yeoman.allcategory[index].name);
  //   this.categorySeted = true;
  //   if (this.yeoman.categories !== undefined) {
  //     this.data.category = this.yeoman.allcategory[index].id;
  //     console.log("id: " + JSON.stringify(this.data.category));
  //   }
  // }
}
