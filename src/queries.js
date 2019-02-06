import gql from 'graphql-tag';

export const WORD_BUCKET = gql`
  query wordBucket {
    WordBucket(id: "cjrgthqd50o4r0104ct3ptpq5") {
      id
      wordPairs {
        id
        word
        translation
      }
    }
  }
`;

export const WORD_VIEW = gql`
  query wordView {
    WordView(id: "cjrgoiw7c1gqd0119d8m3ritu") {
      id
      wordPairs {
        id
        word
        translation
      }
    }
  }
`;

export const CREATE_WORD_PAIR = gql`
  mutation($word: String!, $translation: String!) {
    createWordPair(word: $word, translation: $translation, bucketId: "cjrgthqd50o4r0104ct3ptpq5") {
      id
      word
      translation
    }
  }
`;

export const DELETE_WORD_PAIR = gql`
  mutation($id: ID!) {
    deleteWordPair(id: $id) {
      id
    }
  }
`;
/* Post Queries */
export const GET_POSTS = gql`
  query {
    getPosts {
      _id
      title
      imageUrl
    }
  }
`;

export const ALL_CURRENT_WORD_PAIRS = gql`
  query {
    allCurrentWordPairs {
      word
      translation
    }
  }
`;

// export const ADD_CURRENT_WORD_PAIRS = gql`
//   mutation($word: String!, $translation: String!) {
//     createCurrentWordPair(word: $word, translation: $translation, wordViewId: "cjrgoiw7c1gqd0119d8m3ritu") {
//       id
//       createdAt
//       word
//       translation
//     }
//   }
// `;

export const GET_USER_POSTS = gql`
  query($userId: ID!) {
    getUserPosts(userId: $userId) {
      _id
      title
      imageUrl
      description
      categories
      createdDate
      likes
    }
  }
`;

export const INFINITE_SCROLL_POSTS = gql`
  query($pageNum: Int!, $pageSize: Int!) {
    infiniteScrollPosts(pageNum: $pageNum, pageSize: $pageSize) {
      posts {
        _id
        title
        imageUrl
        categories
        description
        likes
        createdDate
        messages {
          _id
        }
        createdBy {
          _id
          username
          avatar
        }
      }
      hasMore
    }
  }
`;

export const GET_POST = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      _id
      title
      imageUrl
      categories
      description
      likes
      createdDate
      messages {
        _id
        messageBody
        messageDate
        messageUser {
          _id
          username
          avatar
        }
      }
    }
  }
`;

export const SEARCH_POSTS = gql`
  query($searchTerm: String) {
    searchPosts(searchTerm: $searchTerm) {
      _id
      title
      imageUrl
      description
      likes
    }
  }
`;

/* User Queries */
export const GET_CURRENT_USER = gql`
  query {
    allEvents {
      id
      name
    }
  }
`;

/* Post Mutations */

export const ADD_POST = gql`
  mutation($title: String!, $imageUrl: String!, $categories: [String]!, $description: String!, $creatorId: ID!) {
    addPost(
      title: $title
      imageUrl: $imageUrl
      categories: $categories
      description: $description
      creatorId: $creatorId
    ) {
      _id
      title
      imageUrl
      categories
      description
    }
  }
`;

export const UPDATE_USER_POST = gql`
  mutation(
    $postId: ID!
    $userId: ID!
    $title: String!
    $imageUrl: String!
    $categories: [String]!
    $description: String!
  ) {
    updateUserPost(
      postId: $postId
      userId: $userId
      title: $title
      imageUrl: $imageUrl
      categories: $categories
      description: $description
    ) {
      _id
      title
      imageUrl
      description
      categories
      createdDate
      likes
      createdBy {
        _id
        avatar
      }
    }
  }
`;

export const DELETE_USER_POST = gql`
  mutation($postId: ID!) {
    deleteUserPost(postId: $postId) {
      _id
    }
  }
`;

export const ADD_POST_MESSAGE = gql`
  mutation($messageBody: String!, $userId: ID!, $postId: ID!) {
    addPostMessage(messageBody: $messageBody, userId: $userId, postId: $postId) {
      _id
      messageBody
      messageDate
      messageUser {
        _id
        username
        avatar
      }
    }
  }
`;

export const LIKE_POST = gql`
  mutation($postId: ID!, $username: String!) {
    likePost(postId: $postId, username: $username) {
      likes
      favorites {
        _id
        title
        imageUrl
      }
    }
  }
`;

export const UNLIKE_POST = gql`
  mutation($postId: ID!, $username: String!) {
    unlikePost(postId: $postId, username: $username) {
      likes
      favorites {
        _id
        title
        imageUrl
      }
    }
  }
`;

/* User Mutations */
export const SIGNIN_USER = gql`
  mutation($username: String!, $password: String!) {
    signinUser(username: $username, password: $password) {
      token
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    signupUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;
