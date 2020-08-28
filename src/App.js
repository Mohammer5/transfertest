import { Button, Transfer } from '@dhis2/ui'
import { useDataQuery } from '@dhis2/app-runtime'
import React, { useState } from 'react'

const query = {
  dataElements: {
    resource: 'dataElements',
    params: ({ page, pageSize }) => ({
      page,
      pageSize,
    }),
  },
}

const MyApp = () => {
  const [pageSize, setPageSize] = useState(10)
  const [nextPage, setNextPage] = useState(0)
  const [options, setOptions] = useState([])
  const { loading, data, refetch } = useDataQuery(query, { lazy: true })

  const restart = pageSize => {
    setPageSize(pageSize)
    setNextPage(0)
    setOptions([])
  }

  return (
    <>
      <Button onClick={() => restart(10)}>Restart with page size of 10</Button>
      <Button onClick={() => restart(50)}>Restart with page size of 50</Button>
      
      <Transfer
        onChange={() => null}
        options={options}
        onEndReached={() => {
          console.log('onEndReached called')

          if (!loading) {
            console.log('onEndReached called and not loading')

            refetch({ page: nextPage, pageSize }).then(
              response => {
                const newPage = response.dataElements.pager.page
                const newDataElements = response.dataElements.dataElements
                const newOptions = newDataElements.map(({ id, displayName }) => ({
                  value: id,
                  label: displayName,
                }))
                const nextOptions = [...options, ...newOptions]

                setOptions(nextOptions)
                setNextPage(newPage)
              }
            )
          }
        }}
      />
    </>
  )
}

export default MyApp
