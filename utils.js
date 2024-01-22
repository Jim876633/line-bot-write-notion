getCreateNotionPageObj = ({ databaseId, titleId, title, selectId, selectName }) => {
  return {
    parent: {
      type: 'database_id',
      database_id: databaseId,
    },
    properties: {
      [titleId]: {
        title: [
          {
            text: {
              content: title,
              link: {
                url: title
              }
            }
          }
        ]
      },
      [selectId]: {
        select: {
          name: selectName
        }
      }
    }
  }
}

module.exports = {
  getCreateNotionPageObj
}