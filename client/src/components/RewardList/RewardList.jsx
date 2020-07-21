import React from 'react';
import SubHeading from '../Shared/SubHeading/SubHeading';
import RewardList from './RewardsList.style';

export default (props) => {
  const { id, activated, rewarditems } = props;

  if (!activated) {
    return (
      <>
        <SubHeading uppercase>Includes:</SubHeading>
        <RewardList>
          {console.log(rewarditems)}
          {rewarditems.map((item, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={`${id}_${item}-${i}`}>{item}</li>
          ))}
        </RewardList>
      </>
    );
  }

  /* Return a Fragment */
  return <></>;
};
