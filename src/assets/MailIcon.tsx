import { JSX, SVGProps } from 'react';

export function MailIcon({ fill = 'none', ...props }: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      width={props.width ?? 20}
      height={props.height ?? 20}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      fill={fill}
      {...props}
    >
      <path d="M1.66666 5L7.42751 8.26414C9.55132 9.46751 10.4487 9.46751 12.5725 8.26414L18.3333 5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M1.67979 11.2297C1.73427 13.7843 1.76151 15.0616 2.70412 16.0078C3.64673 16.954 4.9586 16.9869 7.58235 17.0529C9.19942 17.0935 10.8006 17.0935 12.4176 17.0529C15.0414 16.9869 16.3533 16.954 17.2959 16.0078C18.2385 15.0616 18.2657 13.7843 18.3202 11.2297C18.3377 10.4083 18.3377 9.59172 18.3202 8.77032C18.2657 6.21571 18.2385 4.9384 17.2959 3.99221C16.3533 3.04602 15.0414 3.01305 12.4176 2.94713C10.8006 2.9065 9.19941 2.9065 7.58234 2.94713C4.9586 3.01304 3.64673 3.046 2.70412 3.9922C1.76151 4.93839 1.73427 6.21569 1.67979 8.77031C1.66228 9.59171 1.66228 10.4083 1.67979 11.2297Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}
