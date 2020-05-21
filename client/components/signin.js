import React, { Component } from 'react'
import { connect } from 'react-redux'

export const signin = () => {
  return (
    <div>
      sign in page
    </div>
  )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(signin)
