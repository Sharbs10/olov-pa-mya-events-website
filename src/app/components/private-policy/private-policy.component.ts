import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-private-policy',
 standalone: true,
   imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './private-policy.component.html',
  styleUrl: './private-policy.component.css'
})
export class PrivatePolicyComponent {

}
