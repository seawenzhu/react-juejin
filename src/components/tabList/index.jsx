import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import ScrollAndTranslate from '../scrollAndTranslate'
import './style.styl'

@ScrollAndTranslate
export default class TabList extends React.Component {
    static defaultProps = {
        syncFixedTop: () => {}
    }

    static propTypes = {
        tabList: PropTypes.array.isRequired,
        getLink: PropTypes.func.isRequired,
        translateTo: PropTypes.bool.isRequired,
        syncFixedTop: PropTypes.func
    }

    state = {
        fixed: false
    }

    componentDidMount() {
        const { top } = $(this.tabListWrapper).offset()
        this.top = top
        // 通知调用者，本组件fixed的临界值
        this.props.syncFixedTop(top)

        window.addEventListener('scroll', this.scrollToFixed)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scrollToFixed)
    }

    scrollToFixed = () => {
        const scrollTop = $(window).scrollTop()

        if (scrollTop >= this.top) {
            !this.state.fixed && this.setState({
                fixed: true
            })
        } else {
            this.state.fixed && this.setState({
                fixed: false
            })
        }
    }

    render() {
        const { tabList, getLink, translateTo } = this.props
        const { fixed } = this.state

        return (
            <div styleName="tab-list-wrapper" ref={tabListWrapper => { this.tabListWrapper = tabListWrapper }}>
                <div styleName={classNames({ 'tab-list': true, fixed, translate: fixed && translateTo })}>
                    {
                        tabList.map((item, index) => (
                            <Link
                                to={getLink(item, index)}
                                key={item.name}
                                styleName="item"
                            >
                                <div styleName="text">{item.name}</div>
                                {
                                    !!item.count && <div styleName="count">{item.count}</div>
                                }
                            </Link>
                        ))
                    }
                </div>
            </div>
        )
    }
}
