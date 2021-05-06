import { Component, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AuthService, TOKEN_NAME} from '../shared/services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-todos',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']

})
export class TodoComponent implements OnInit {
  public userName = '';
  visibility= 'all';
  filteredTodos = [];
  public todos: any[] = [
    {
      text: 'Abc',
      complete: true
    },
    {
      text: 'Cde',
      complete: false
    }
  ];
  public formTodo: FormGroup;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private readonly formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.userName = this.authService.getUsername();
    this.filterTodos('all');
  }

  createForm(){
    const formFields = {
      nextTodo: ['', [Validators.required]]
    };
    this.formTodo = this.formBuilder.group(formFields);
    this.formTodo.controls['nextTodo']
      .valueChanges
      .subscribe((value) => {
        console.log('new todo: ' + value);
      });
  }

  filterTodos(filter: string) {
    this.visibility = filter;
    if (filter === 'all') {
      this.filteredTodos = this.todos.map((todo) => todo);
    }
    if (filter === 'complete') {
      this.filteredTodos = this.todos.filter((todo) => todo.complete);
    }
    if (filter === 'incomplete') {
      this.filteredTodos = this.todos.filter((todo) => !todo.complete);
    }
  }

  toggleTodo(todo: any) {
    todo.complete = !todo.complete;
    this.filterTodos(this.visibility);
  }

  addTodo() {
    if (this.formTodo.controls['nextTodo'].value) {
      this.todos.push({
        text: this.formTodo.controls['nextTodo'].value,
        complete: false
      });
      this.filterTodos(this.visibility);
      this.formTodo.controls['nextTodo'].setValue('');
    }
  }

  deleteTodo(index: number) {
    if (this.visibility === 'all') {
      this.todos.splice(index, 1);
    } else {
      const findCompleted = (this.visibility === 'complete') ? true : false;
      const matchedIdxs = [];
      this.todos.map((todo, idx) => {
        if(todo.complete === findCompleted) {
          matchedIdxs.push(idx);
        }
      });
      this.todos.splice(matchedIdxs[index], 1);
    }
    this.filterTodos(this.visibility);
  }

}
