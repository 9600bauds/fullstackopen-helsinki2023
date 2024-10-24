import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AddBlogForm from './AddBlogForm';

const blogObject = {
  "title": `Hello World`,
  "author": `Terry`,
  "url": `www.hmmm.com`,
};

describe(`default new blog form`, async () => {
  test(`calls event handler with correct blog details`, async () => {
    const mockSuccessMessage = vi.fn();
    const mockErrorMessage = vi.fn();
    const mockCreateBlog = vi.fn();
    
    render(
      <AddBlogForm 
        successMessage={mockSuccessMessage}
        errorMessage={mockErrorMessage}
        createBlog={mockCreateBlog}
      />
    );

    const user = userEvent.setup();
    const titleInput = screen.getByLabelText(`Title:`);
    await user.type(titleInput, blogObject.title);
    const authorInput = screen.getByLabelText(`Author:`);
    await user.type(authorInput, blogObject.author);
    const urlInput = screen.getByLabelText(`URL:`);
    await user.type(urlInput, blogObject.url);

    const submitButton = screen.getByText(`Submit`);
    await user.click(submitButton);

    //screen.debug();
  
    expect(mockCreateBlog).toHaveBeenCalledWith(blogObject);
  });

});