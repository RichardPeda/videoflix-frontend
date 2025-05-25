import { Component, computed, effect, input } from '@angular/core';
import { Video } from '../../../../core/models/video';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stars-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stars-ranking.component.html',
  styleUrl: './stars-ranking.component.scss',
})
export class StarsRankingComponent {
  videoRanking = input<number | undefined>(undefined);
  size = input<number>(10);

  videostars = computed(() => {
    const ranking = this.videoRanking();
    return ranking ? this.getStars(ranking) : [];
  });

  /**
   * Converts a numeric ranking into an array representing star ratings.
   *
   * The returned array contains exactly 5 elements, each being one of:
   * - 'full' for a full star,
   * - 'half' for a half star (if ranking fractional part is between 0.25 and 0.75),
   * - 'empty' for an empty star.
   *
   * @param {number} ranking - The numeric ranking value (e.g., 3.5)
   * @returns {('full' | 'half' | 'empty')[]} An array representing the star rating
   */
  getStars(ranking: number): ('full' | 'half' | 'empty')[] {
    const stars: ('full' | 'half' | 'empty')[] = [];
    const fullCount = Math.floor(ranking);
    const hasHalf = ranking % 1 >= 0.25 && ranking % 1 < 0.75;
    const emptyCount = 5 - fullCount - (hasHalf ? 1 : 0);

    for (let i = 0; i < fullCount; i++) stars.push('full');
    if (hasHalf) stars.push('half');
    for (let i = 0; i < emptyCount; i++) stars.push('empty');

    return stars;
  }
}
