import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './item-details.component.html'
})
export class ItemDetailsComponent {
  private idSig = signal<string>('');

  @Input() set id(value: string) {
    this.idSig.set(value);
  }

  constructor(public data: DataService) {}

  plan = computed(() => this.data.plans().find((p) => p.id === this.idSig()));
  trainer = computed(() => this.data.trainers().find((t) => t.id === this.idSig()));
  gymClass = computed(() => this.data.classes().find((c) => c.id === this.idSig()));

  notFound = computed(() => !this.plan() && !this.trainer() && !this.gymClass());
}
