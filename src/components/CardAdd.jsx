import React, { useState } from 'react';
import { X, Plus } from 'react-feather';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
const CardAdd = (props) => {
  const [card, setCard] = useState('');
  const [show, setShow] = useState(false);

  const saveCard = () => {
    if (!card) {
      return;
    }
    props.getcard(card);
    setCard('');
    setShow(!show);
  };

  const closeBtn = () => {
    setCard('');
    setShow(!show);
  };

  return (
    <div>
      <div className="flex flex-col">
        {show && (
          <div>
            <textarea
              value={card}
              onChange={(e) => setCard(e.target.value)}
              className="p-1 w-full rounded-md border-2 bg-zinc-700 border-zinc-900"
              name=""
              id=""
              cols="30"
              rows="2"
              placeholder="Enter Card Title..."
            ></textarea>
            <div className="flex p-1">
              <button
                onClick={() => saveCard()}
                className="p-1 rounded bg-sky-600 text-white mr-2"
              >
                Add Card
              </button>
              <button
                onClick={() => closeBtn()}
                className="p-1 rounded hover:bg-gray-600"
              >
                <X size={16}></X>
              </button>
            </div>
          </div>
        )}
        {!show && (
            
            <div style={{ marginTop: '10px' }}>
  <Button 
    variant="outlined" 
    size="small" 
    onClick={() => setShow(!show)}
  >
    <Fab size="small" color="secondary" aria-label="add"  style={{ width: '30px', height: '30px', minHeight: 'unset',marginRight: '8px'  }} >
        <AddIcon  />
      </Fab> New
  </Button>
</div>

        )}
      </div>
    </div>
  );
};

export default CardAdd;
