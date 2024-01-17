import React, { useTransition } from 'react'
import { Button } from './ui/button'
import { HiSaveAs } from 'react-icons/hi'
import useDesigner from './hooks/use-designer';
import { UpdateFormContent } from '@/actions/form';
import { toast } from './ui/use-toast';
import { FaSpinner } from 'react-icons/fa';

const SaveFormBtn = ({id}:{id: number}) => {
  const {elements} = useDesigner();
  const [loading, startTransition] = useTransition();

  const updateFormContent = async () => {
    try {
      const JsonElements = JSON.stringify(elements);
      await UpdateFormContent(id, JsonElements);
      toast({
        title: "Success",
        description: "Your form has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Your form could not be saved.",
        variant: "destructive"
      })
    }
  };
  return (
    <Button 
      variant={'outline'} 
      className='gap-2' 
      disabled={loading} 
      onClick={() => {
        startTransition(updateFormContent)
      }}
    >
        <HiSaveAs className='h-4 w-4' />
        Save
        {loading && <FaSpinner className='animate-spin h-4 w-4' />}
    </Button>
  )
}

export default SaveFormBtn