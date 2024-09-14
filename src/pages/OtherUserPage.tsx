import React, { useState, useEffect, useContext } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import PostsList from '../components/PostsList';
import NewPost from '../components/NewPost';
import { UserContext } from '../components/UserContext';

type DrawerParamList = {
  OtherUser: { id: string};
};

function OtherUserPage() {
  const route = useRoute<RouteProp<DrawerParamList, 'OtherUser'>>();
  const { id: searchedUserId } = route.params;
  const userContext = useContext(UserContext);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  //const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const { user } = userContext || {};
  const jwtToken = localStorage.getItem('jwtToken');

  //console.log('searched user id: ', searchedUserId);

  useEffect(() => {
    if (!user?.id || !searchedUserId) return;
    const getFriendStatus = async () => {
      try {
        if (!user.id || !searchedUserId) return;
        const requestData = {
          loggedInUserId: user.id,
          otherUserId: Number(searchedUserId)
        };

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/friend/getfriendstatus`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(requestData),
        });
        const result = await response.json();
        setIsFriend(result);
        console.log(result);
      } catch (error) {
        console.error('Error getting friend status:', error);
      }
    };

    // const getBlockedStatus = async () => {
    //   try {
    //     if (!user.id || !searchedUserId) return;
    //     const requestData = {
    //       blockerUserId: user.id,
    //       blockedUserId: searchedUserId
    //     };

    //     const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/block/getblockedstatus`, {
    //       method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${jwtToken}`,
    //         },
    //         body: JSON.stringify(requestData),
    //     });
    //     const result = await response.json();
    //     setIsBlocked(result);
    //     console.log(result);
    //   } catch (error) {
    //     console.error('Error getting blocked status:', error);
    //   }
    // };
    
    getFriendStatus();
    //getBlockedStatus();
  }, [user?.id, searchedUserId, jwtToken]);

  const handleRequestFriend = () => {
    const requestFriend = async () => {
      try {
        if (!user?.id || !searchedUserId) return;
        const requestData = {
          fromUserId: user.id,
          toUserId: searchedUserId
        };

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/friend/request`, {
          method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(requestData),
        });
      } catch (error) {
        console.error('Error requesting friend:', error);
      }
    };
    
    requestFriend();
  }

  const handleRemoveFriend = () => {
    const removeFriend = async () => {
      try {
        if (!user?.id || !searchedUserId) return;
        const requestData = {
          userId1: user.id,
          userId2: searchedUserId
        };

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/friend/delete`, {
          method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(requestData),
        });
      } catch (error) {
        console.error('Error removing friend:', error);
      }
    };
      
    removeFriend();
  }

  // const handleBlockUser = () => {
  //   const blockUser = async () => {
  //     try {
  //       if (!user?.id || !searchedUserId) return;
  //       const requestData = {
  //         blockerUserId: user.id,
  //         blockedUserId: searchedUserId
  //       };

  //       const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/block/create`, {
  //         method: 'POST',
  //           headers: {
  //               'Content-Type': 'application/json',
  //               Authorization: `Bearer ${jwtToken}`,
  //           },
  //           body: JSON.stringify(requestData),
  //       });
  //     } catch (error) {
  //       console.error('Error blocking user:', error);
  //     }
  //   };
      
  //   blockUser();
  // }

  // const handleUnblockUser = () => {
  //   const unblockUser = async () => {
  //     try {
  //       if (!user?.id || !searchedUserId) return;
  //       const requestData = {
  //         blockerUserId: user.id,
  //         blockedUserId: searchedUserId
  //       };

  //       const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/block/delete`, {
  //         method: 'POST',
  //           headers: {
  //               'Content-Type': 'application/json',
  //               Authorization: `Bearer ${jwtToken}`,
  //           },
  //           body: JSON.stringify(requestData),
  //       });
  //     } catch (error) {
  //       console.error('Error blocking user:', error);
  //     }
  //   };
      
  //   unblockUser();
  // }

  if (!userContext || !userContext.user) return null;

  return (
    <>
      {searchedUserId && <NewPost profUID={searchedUserId} />}
      {searchedUserId && <PostsList id={searchedUserId} />}
      {!isFriend && (<button onClick={() => handleRequestFriend()}>Send Request</button>)}
      {isFriend && (<button onClick={() => handleRemoveFriend()}>Remove Friend</button>)}
      {/* {!isBlocked && (<button onClick={() => handleBlockUser()}>Block User</button>)}
      {isBlocked && (<button onClick={() => handleUnblockUser()}>Unblock User</button>)} */}
    </>
  )
}

export default OtherUserPage;
