import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import type { ComponentProps } from 'react'
import type { LucideIcon } from 'lucide-react'

export const sidebarItemVariants = tv({
	base: [
		'flex w-full cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors',
		'text-foreground hover:border-border hover:bg-surface-raised',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
		'disabled:pointer-events-none disabled:opacity-50',
	],
	variants: {
		active: {
			true: 'border-border bg-surface-raised',
			false: '',
		},
	},
	defaultVariants: {
		active: false,
	},
})

export interface SidebarItemProps
	extends ComponentProps<'button'>,
		VariantProps<typeof sidebarItemVariants> {
	description?: string
	icon: LucideIcon
	label: string
}

export function SidebarItem({
	active,
	className,
	description,
	icon: Icon,
	label,
	...props
}: SidebarItemProps) {
	return (
		<button
			type="button"
			data-slot="sidebar-item"
			data-active={active ? '' : undefined}
			className={twMerge(sidebarItemVariants({ active }), className)}
			{...props}
		>
			<span
				data-slot="sidebar-item-icon"
				className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
			>
				<Icon
					aria-hidden="true"
					className="size-4"
				/>
			</span>
			<span className="min-w-0">
				<span className="block truncate text-sm font-medium">
					{label}
				</span>
				{description ? (
					<span className="block truncate text-xs text-muted-foreground">
						{description}
					</span>
				) : null}
			</span>
		</button>
	)
}
