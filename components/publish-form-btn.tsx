import { PublishForm } from '@/actions/form'

import React, { startTransition, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { MdOutlinePublish } from 'react-icons/md'
import { FaSpinner } from 'react-icons/fa'

import { Button } from './ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from './ui/use-toast'

function PublishFormBtn({id}: {id: number}) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const publishForm = async () => {
    try {
      await PublishForm(id);

      toast({
        title: "Success",
        description: "Your form has been published successfully.",
      });

      router.refresh();

    } catch (error) {
      toast({
        title: "Error",
        description: "Your form could not be published.",
      })
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className='gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400'>
          <MdOutlinePublish className='h-4 w-4' />
          Publish
      </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. 
            After publishing you will not be able to editi this form. <br /> <br />
            <span className='font-medium'>
              By publishing this form you will make it available to the public 
              and you will be able to collect submissions.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              startTransition(publishForm)
            
            }} 
            className='bg-gradient-to-r from-indigo-400 to-cyan-400'
          >
            Proceed {loading && <FaSpinner className='animate-spin h-4 w-4' />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default PublishFormBtn