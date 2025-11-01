import { mount } from '@vue/test-utils'
import AddItemForm from '../components/AddItemForm.vue'

// Mock axios to avoid backend calls
vi.mock('../api', () => ({
  default: {
    post: vi.fn(() => Promise.resolve({ data: 'Item submitted successfully!' }))
  }
}))

describe('AddItemForm.vue', () => {
  test('renders and validates all fields including location', async () => {
    const wrapper = mount(AddItemForm)

    // 🧩 Fill invalid values
    const textInputs = wrapper.findAll('input[type="text"]')
    await textInputs[0].setValue('ab') // title (<3 chars)
    await wrapper.find('textarea').setValue('short') // description (<10 chars)
    await textInputs[1].setValue('') // location (required)
    await textInputs[2].setValue('') // reporterName (<2 chars)
    await textInputs[3].setValue('not-an-email') // reporterContact (invalid)
    await wrapper.find('select').setValue('false') // Lost type

    // 🧠 Submit form
    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    // ✅ Check error messages
    const text = wrapper.text()
    expect(text).toContain('Title must be at least 3 characters.')
    expect(text).toContain('Description must be at least 10 characters.')
    expect(text).toContain('Enter your name.')
    expect(text).toContain('Enter a valid email or 10-digit phone number.')

    // 🧪 Ensure no submission when invalid
    expect(wrapper.vm.message).toBe('')
  })

  test('disables submit button when invalid', async () => {
    const wrapper = mount(AddItemForm)
    const button = wrapper.find('button[type="submit"]')
    expect(button.attributes('disabled')).toBeDefined()
  })

  test('submits successfully when form valid', async () => {
    const wrapper = mount(AddItemForm)
    const textInputs = wrapper.findAll('input[type="text"]')

    // 🧩 Fill valid values
    await textInputs[0].setValue('Lost Phone') // title
    await wrapper.find('textarea').setValue('A black phone found near canteen.') // description
    await textInputs[1].setValue('Canteen') // location
    await textInputs[2].setValue('Darshan') // reporterName
    await textInputs[3].setValue('darshan@example.com') // valid email
    await wrapper.find('select').setValue('true')

    // 🧠 Submit the form
    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    // ✅ Assert success message is shown
    expect(wrapper.text()).toContain('Item submitted successfully!')
  })
})
