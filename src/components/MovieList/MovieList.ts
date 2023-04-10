import MovieCard from '../MovieCard/MovieCard';

import Component from '../../type/Component';
import { Movie } from '../../type/Movie';

import { createIntersectionObserver } from '../../utils';

import errorImg from '../../assets/error.jpg';

import './movieList.css';

const headerTemplate = {
  popular: '지금 인기 있는 영화',

  search(query: string) {
    return `"${query}" 검색 결과`;
  },
};

const errorTemplate = (statusCode: number, statusMessage: string) => {
  return `
  <div class="error-container">
    <h1 class="error-heading">죄송합니다. 영화 목록을 불러올 수 없습니다. 관리자에게 문의해주세요.</h1>
    <p class="error-code">error code: ${statusCode}</p>
    <p class="error-message">error message: ${statusMessage}</p>
    <img class="error-img" src=${errorImg} alt="error-img" />
  </div>`;
};

type HandlerCallback = {
  onObserveElement: () => void;
  onClickCard: (movieId: string) => void;
};

export default class MovieList implements Component {
  private $element;
  private intersectionObserver = createIntersectionObserver({
    onIntersection: this.handlerCallback.onObserveElement,
    option: { rootMargin: '1200px 0px' },
  });

  constructor($parent: Element, private handlerCallback: HandlerCallback) {
    this.$element = document.createElement('section');
    this.$element.className = 'item-view';

    $parent.insertAdjacentElement('beforeend', this.$element);
  }

  render(query?: string) {
    this.$element.innerHTML = this.template(query);
    this.setEvent();
  }

  template(query?: string) {
    const header = query ? headerTemplate.search(query) : headerTemplate.popular;

    return /* html */ `
    <h2 class="list-title">${header}</h2>     
    <ul class="item-list"></ul> 
    <ul class="skeleton-item-list item-list hide">
      ${this.getSkeletonCardsHTML(20)}
    </ul>
    <div id="observe-target" class="observe-target"></div>`;
  }

  setEvent() {
    this.observe();
  }

  observe() {
    const $observeTarget = this.$element.querySelector('#observe-target');
    if (!($observeTarget instanceof HTMLDivElement)) return;

    this.intersectionObserver.observe($observeTarget);
  }

  unObserve() {
    const $observeTarget = this.$element.querySelector('#observe-target');
    if (!($observeTarget instanceof HTMLDivElement)) return;

    this.intersectionObserver.unobserve($observeTarget);
  }

  renderErrorTemplate(statusCode: number, statusMessage: string) {
    this.$element.innerHTML = errorTemplate(statusCode, statusMessage);
  }

  renderMovieCards(movieList: Movie[]) {
    const $ul = this.$element.querySelector('.item-list');
    if ($ul === null) return;

    movieList.forEach((movie) => {
      new MovieCard($ul, { onClickCard: this.handlerCallback.onClickCard }).render(movie);
    });
  }

  getSkeletonCardsHTML(count: number) {
    const skeletonCardHTML = `
    <li>
      <a href="#">
        <div class="item-card">
          <div class="item-thumbnail skeleton"></div>
          <div class="item-title skeleton"></div>
          <div class="item-score skeleton"></div>
        </div>
      </a>
    </li>`;

    return skeletonCardHTML.repeat(count);
  }

  isLastPage(page: number, totalPages: number) {
    return page === totalPages;
  }

  showSkeletonList() {
    const $skeletonList = this.$element.querySelector('.skeleton-item-list');
    if (!($skeletonList instanceof HTMLUListElement)) return;

    $skeletonList.classList.remove('hide');
  }

  hideSkeletonList() {
    const $skeletonList = this.$element.querySelector('.skeleton-item-list');
    if (!($skeletonList instanceof HTMLUListElement)) return;

    $skeletonList.classList.add('hide');
  }

  hideMoreButton() {
    const $moreButton = this.$element.querySelector('#more-button');
    if (!($moreButton instanceof HTMLButtonElement)) return;

    $moreButton.classList.add('hide');
  }
}
