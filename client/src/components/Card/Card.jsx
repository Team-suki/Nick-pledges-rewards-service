/* Import Modules */
import React, { useState } from 'react';
/* Import Components */
import Container from '../Shared/Container/Container';
import Overlay from '../Shared/Overlay/Overlay';
import Heading from '../Shared/Heading/Heading';
import SubHeading from '../Shared/SubHeading/SubHeading';
import Title from '../Shared/Title/Title';
import Description from '../Shared/Description/Description';
import RewardList from '../RewardList/RewardList';
import SplitContainer from '../Shared/SplitContainer/SplitContainer';
import SmallTitle from '../Shared/SmallTitle/SmallTitle';
import BackerHeading from '../Shared/BackerHeading/BackerHeading';
import PledgeForm from '../PledgeForm/PledgeForm';

/**
 * Card Component
 * @param props
 * @returns {*}
 * @constructor
 */
const Card = (props) => {
  /* Use Hooks to create state component for the description container */
  const [descOpen, setDescOpen] = useState(false);
  const [activated, setActivated] = useState(false);

  const { reward } = props;
  // const {
  //   id,
  //   title,
  //   pledge_amount,
  //   description,
  //   delivery_month,
  //   delivery_year,
  //   reward_quantity,
  //   reward_items,
  // } = reward;

  const currencyConverted = Math.floor(reward.pledge_amount * 0.8);

  /* Return the JSX to render */
  return (
    <Container activated={activated}>
      <Overlay activated={activated} setActivated={setActivated} />
      <Heading>{`Pledge $${reward.pledge_amount} or more`}</Heading>
      <SubHeading uppercase>{`About £${currencyConverted}`}</SubHeading>
      <Title uppercase>{reward.title}</Title>
      <Description
        descOpen={descOpen}
        activated={activated}
        setDescOpen={setDescOpen}
        description={reward.description}
      />
      <RewardList id={reward.id} activated={activated} rewarditems={reward.reward_items} />
      <SplitContainer>
        <div>
          <SubHeading uppercase>
            Estimated
            <br />
            delivery
          </SubHeading>
          <SmallTitle uppercase={false}>
            {`${reward.delivery_month.substring(0, 3)} ${reward.delivery_year}`}
          </SmallTitle>
        </div>
        <div>
          <SubHeading uppercase>Ships To</SubHeading>
          <SmallTitle uppercase={false}>Anywhere in the world</SmallTitle>
        </div>
      </SplitContainer>
      <BackerHeading activated={activated}>
        {`${reward.reward_quantity} Backers`}
      </BackerHeading>
      <PledgeForm activated={activated} />
    </Container>
  );
};

/* Export the component - use the withTheme hook to allow theme access inside of this component */
export default Card;
