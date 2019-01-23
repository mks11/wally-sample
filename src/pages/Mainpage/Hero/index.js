import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  Carousel,
  CarouselItem,
  CarouselIndicators,
} from 'reactstrap'

const getBannerImageLink = (index, isMobile = false, isHorizontal = false) => {
  const BASE_URL = 'https://s3.us-east-2.amazonaws.com/the-wally-shop-app/banner-images/'
  const imageName = `${isMobile ? 'mobile-' : ''}${isHorizontal ? 'horiz-' : ''}banner-${index}.png`
  return `${BASE_URL}${imageName}`
}

const heroItems = [
  {
    src: getBannerImageLink(1),
    altText: 'Slide 1',
    caption: 'Slide 1',
    link: '/help/detail/5b9159765e3b27043b178f93'
  },
  {
    src: getBannerImageLink(2),
    altText: 'Slide 2',
    caption: 'Slide 2',
    link: '/help/detail/5b91595b5e3b27043b178f92'
  },
  {
    src: getBannerImageLink(3),
    altText: 'Slide 3',
    caption: 'Slide 3',
    link: '/help/topics/5b9158325e3b27043b178f91'
  },
]

class Hero extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeIndex: 0,
      width: window.innerWidth,
    }
  }

  componentDidUpdate() {
    // todo: update this logic
    if (window.innerWidth <= 800 && window.innerWidth > 500) {
      heroItems.forEach((item, index) => item.src = getBannerImageLink(index + 1, true, true))
    } else if (window.innerWidth <= 500) {
      heroItems.forEach((item, index) => item.src = getBannerImageLink(index + 1, true))
    } else {
      heroItems.forEach((item, index) => item.src = getBannerImageLink(index + 1))
    }
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange)
  }
  
  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth })
  };

  onExiting = () => { this.animating = true }

  onExited = () => { this.animating = false }

  next = () => {
    if (this.animating) return
    const { activeIndex } = this.state
    const nextIndex = activeIndex === heroItems.length - 1 ? 0 : activeIndex + 1
    this.setState({ activeIndex: nextIndex })
  }

  previous = () => {
    if (this.animating) return
    const { activeIndex } = this.state
    const nextIndex = activeIndex === 0 ? heroItems.length - 1 : activeIndex - 1
    this.setState({ activeIndex: nextIndex })
  }

  goToIndex = index => {
    if (this.animating) return;
    this.setState({ activeIndex: index })
  }

  render() {
    const { activeIndex, width } = this.state
    const isMobile = width <= 500

    let heroContent = (
      <Carousel
        activeIndex={activeIndex}
        next={this.next}
        previous={this.previous}
      >
        <CarouselIndicators
          items={heroItems}
          activeIndex={activeIndex}
          onClickHandler={this.goToIndex}
        />
        {
          heroItems.map(item => (
            <CarouselItem
              onExiting={this.onExiting}
              onExited={this.onExited}
              key={item.caption}
            >
              <Link to={item.link}>
                <img
                  className="img-fluid"
                  src={item.src}
                  alt={item.altText}
                />
              </Link>
            </CarouselItem>
          )
        )
        }
      </Carousel>
    )

    if (isMobile) {
      const link = heroItems[2].link
      const src = getBannerImageLink(3, true)

      heroContent = (
        <Link to={link}>
          <img
            className="img-fluid"
            src={src}
            alt=""
          />
        </Link>
      )
    }

    return heroContent
  }
}

export default Hero