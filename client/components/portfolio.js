import React, { Component } from 'react'
import { connect } from 'react-redux'

export const portfolio = () => {
  return (
    <div>
      Portfolio
    </div>
  )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(portfolio)
